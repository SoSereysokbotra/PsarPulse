import { db } from "../lib/db";
import { vendorPlans, paymentTransactions } from "../lib/db/schema";
import { eq, and } from "drizzle-orm";

async function main() {
  const args = process.argv.slice(2);
  const apply = args.includes("--apply");

  const desired: Record<string, string> = {
    pro: "2.99",
    premium: "6.99",
  };

  console.log("Scanning vendor plans...");
  for (const [name, price] of Object.entries(desired)) {
    const plan = await db
      .select()
      .from(vendorPlans)
      .where(eq(vendorPlans.name, name))
      .limit(1)
      .then((r) => r[0]);
    if (!plan) {
      console.log(`Plan ${name} not found — skipping`);
      continue;
    }
    const current = String(plan.monthlyPrice);
    console.log(
      `Plan ${name}: current monthlyPrice=${current}, desired=${price}`,
    );
    if (current !== price) {
      if (apply) {
        await db
          .update(vendorPlans)
          .set({ monthlyPrice: price })
          .where(eq(vendorPlans.id, plan.id));
        console.log(`Updated plan ${name} monthlyPrice -> ${price}`);
      } else {
        console.log(
          `DRY RUN: would update plan ${name} to ${price} (use --apply to commit)`,
        );
      }
    }
  }

  console.log("Scanning payment transactions (USD, amount < 1.0)...");
  for (const [name, price] of Object.entries(desired)) {
    const rows = await db
      .select()
      .from(paymentTransactions)
      .where(
        and(
          eq(paymentTransactions.planCode, name),
          eq(paymentTransactions.currency, "USD"),
        ),
      );

    const toFix = rows.filter((r) => Number(r.amount) < 1.0);
    console.log(
      `Found ${rows.length} transactions for plan ${name}, ${toFix.length} look like small-amount candidates.`,
    );

    if (toFix.length > 0) {
      for (const tx of toFix) {
        console.log(`Tx ${tx.transactionId}: amount=${tx.amount} -> ${price}`);
        if (apply) {
          await db
            .update(paymentTransactions)
            .set({ amount: price })
            .where(eq(paymentTransactions.id, tx.id));
          console.log(`  Updated ${tx.transactionId}`);
        }
      }
    }
  }

  console.log(`Done. apply=${apply}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

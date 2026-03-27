import "dotenv/config";
import { db } from "../lib/db/index";
import { vendors, paymentTransactions } from "../lib/db/schema/index";

async function check() {
  const tx = await db.query.paymentTransactions.findMany({
    orderBy: (t, { desc }) => [desc(t.createdAt)],
    limit: 5,
  });
  console.log("Recent Transactions:", JSON.stringify(tx, null, 2));

  const vs = await db.query.vendors.findMany({
    with: { user: true, plan: true },
    limit: 3,
  });
  console.log("Vendors:", JSON.stringify(vs, null, 2));
}

check().catch(console.error).then(() => process.exit(0));

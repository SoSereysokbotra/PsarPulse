import "dotenv/config";
import { db } from "../lib/db";
import { vendorPlans } from "../lib/db/schema";
import { eq } from "drizzle-orm";

async function main() {
    await db.update(vendorPlans).set({ monthlyPrice: "0", yearlyPrice: "0" }).where(eq(vendorPlans.name, "free"));
    await db.update(vendorPlans).set({ monthlyPrice: "2.99", yearlyPrice: "29.90" }).where(eq(vendorPlans.name, "pro"));
    await db.update(vendorPlans).set({ monthlyPrice: "6.99", yearlyPrice: "69.90" }).where(eq(vendorPlans.name, "premium"));
    console.log("Plans updated successfully!");
    process.exit(0);
}

main().catch(console.error);

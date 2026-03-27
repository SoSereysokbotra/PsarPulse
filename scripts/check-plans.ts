import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());

import { db } from "../lib/db/index";
import { vendorPlans } from "../lib/db/schema/index";

async function run() {
  const plans = await db.select().from(vendorPlans);
  console.log("PLANS:", plans);
}

run().catch(console.error).then(() => process.exit(0));

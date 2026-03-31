import "dotenv/config";
import { sql } from "drizzle-orm";
// We need to import db
import { db } from "./lib/db/index";

async function run() {
  try {
    console.log("Starting manual migration to add vendor_goals table...");

    // Remove daily_goal from vendors if it exists
    await db.execute(sql`ALTER TABLE "vendors" DROP COLUMN IF EXISTS "daily_goal";`);

    // Create vendor_goals table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "vendor_goals" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "vendor_id" uuid NOT NULL REFERENCES "vendors"("id") ON DELETE cascade,
        "target_amount" DECIMAL(10, 2) NOT NULL,
        "type" varchar(50) DEFAULT 'daily_revenue' NOT NULL,
        "is_active" boolean DEFAULT true,
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL
      );
    `);

    console.log("Migration complete!");
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    process.exit(0);
  }
}

run();

import "dotenv/config";
import { sql } from "drizzle-orm";
import { db } from "./lib/db/index";

async function run() {
  try {
    console.log("Starting manual schema change for vendors...");
    
    await db.execute(sql`
      ALTER TABLE "vendors" 
      ADD COLUMN IF NOT EXISTS "cover_image" varchar(512),
      ADD COLUMN IF NOT EXISTS "category" varchar(100),
      ADD COLUMN IF NOT EXISTS "latitude" numeric(10, 8),
      ADD COLUMN IF NOT EXISTS "longitude" numeric(11, 8),
      ADD COLUMN IF NOT EXISTS "rating" numeric(3, 2) DEFAULT '0',
      ADD COLUMN IF NOT EXISTS "delivery_time" varchar(50);
    `);
    
    console.log("Schema change applied.");
    
    console.log("Populating mock active vendors...");
    
    // Check if there are any vendors, if none create some dummy ones for testing.
    // If they exist, update them. We will just update any existing vendors so they show up.
    
    await db.execute(sql`
      UPDATE "vendors" 
      SET 
        "cover_image" = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=600',
        "category" = 'coffee',
        "latitude" = 11.5621,
        "longitude" = 104.888,
        "rating" = 4.8,
        "delivery_time" = '20-30',
        "is_verified" = true,
        "status" = 'active'
      WHERE "category" IS NULL;
    `);

    console.log("Mock data updated.");
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    process.exit(0);
  }
}

run();

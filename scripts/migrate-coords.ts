import { migrationClient } from "../lib/db";

async function migrate() {
  console.log("Starting manual migration...");
  try {
    // Add columns to vendors
    await migrationClient`ALTER TABLE "vendors" ADD COLUMN IF NOT EXISTS "latitude" numeric(10, 8);`;
    await migrationClient`ALTER TABLE "vendors" ADD COLUMN IF NOT EXISTS "longitude" numeric(11, 8);`;
    await migrationClient`ALTER TABLE "vendors" ADD COLUMN IF NOT EXISTS "is_public" boolean DEFAULT true;`;
    console.log("Updated vendors table.");

    // Add columns to vendor_requests
    await migrationClient`ALTER TABLE "vendor_requests" ADD COLUMN IF NOT EXISTS "latitude" numeric(10, 8);`;
    await migrationClient`ALTER TABLE "vendor_requests" ADD COLUMN IF NOT EXISTS "longitude" numeric(11, 8);`;
    await migrationClient`ALTER TABLE "vendor_requests" ADD COLUMN IF NOT EXISTS "is_public" boolean DEFAULT true;`;
    console.log("Updated vendor_requests table.");

    console.log("Migration completed successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

migrate();

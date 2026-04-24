import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { config } from "dotenv";

config({ path: ".env" });

// Migrations MUST use the direct (non-pooled) connection.
// pgBouncer (port 6543 with ?pgbouncer=true) doesn't support DDL.
// Use DATABASE_DIRECT_URL if set, otherwise fall back to DATABASE_URL.
const connectionString =
  process.env.DATABASE_DIRECT_URL || process.env.DATABASE_URL || "";

if (!connectionString) {
  console.error("No DATABASE_DIRECT_URL or DATABASE_URL found in .env");
  process.exit(1);
}

const sql = postgres(connectionString, { max: 1, ssl: "require" });
const db = drizzle(sql);

async function main() {
  try {
    console.log("Running migrations...");
    await migrate(db, { migrationsFolder: "lib/db/migrations" });
    console.log("✅ Migration successful");
  } catch (error: any) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

main();

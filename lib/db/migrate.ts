import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

const connectionString = process.env.DATABASE_URL || "";

const sql = postgres(connectionString, { max: 1, ssl: "require" });
const db = drizzle(sql);

async function main() {
  try {
    console.log("Running migrations...");
    await migrate(db, { migrationsFolder: "lib/db/migrations" });
    console.log("Migration successful");
  } catch (error: any) {
    console.error("Migration failed", error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

main();

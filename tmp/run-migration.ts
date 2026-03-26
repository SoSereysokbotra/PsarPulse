import postgres from "postgres";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

async function migrate() {
  const sqlFile = "./lib/db/migrations/0002_init_vendor_tables.sql";
  const sqlContent = fs.readFileSync(sqlFile, "utf-8");
  
  // Split by statement-breakpoint
  const statements = sqlContent.split("--> statement-breakpoint");
  
  const connectionString = process.env.DATABASE_URL!;
  const sql = postgres(connectionString);

  console.log("Starting manual migration...");
  try {
    for (let statement of statements) {
      statement = statement.trim();
      if (!statement) continue;
      console.log("Executing:", statement.substring(0, 50) + "...");
      try {
        await sql.unsafe(statement);
      } catch (inner) {
        // Some columns might already exist from previous partial runs
        console.warn("Statement skipped or failed (might already exist):", (inner as any).message);
      }
    }
    console.log("Migration finished!");
  } catch (e) {
    console.error("Migration absolute failure:", e);
  } finally {
    await sql.end();
  }
}

migrate();

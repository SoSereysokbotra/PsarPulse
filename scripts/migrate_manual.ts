import postgres from "postgres";
import { config } from "dotenv";

config({ path: ".env" });

async function migrate() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("DATABASE_URL is not set");
    process.exit(1);
  }

  const sql = postgres(connectionString);
  
  try {
    console.log("Adding avatar_url column to users table...");
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT;`;
    console.log("Migration successful!");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await sql.end();
  }
}

migrate();

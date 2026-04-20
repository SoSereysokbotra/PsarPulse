import { config } from "dotenv";
config();
import { db } from "./lib/db/index.js";
import { sql } from "drizzle-orm";

async function addCol() {
  try {
    await db.execute(sql`ALTER TABLE payment_transactions ADD COLUMN IF NOT EXISTS receipt_url text;`);
    console.log("Column added successfully!");
  } catch (err) {
    console.error("Error migrating:", err);
  }
  process.exit(0);
}

addCol();

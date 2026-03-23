import { config } from "dotenv";
config({ path: ".env" });
import postgres from "postgres";

async function main() {
  console.log("Connecting to DB:", process.env.DATABASE_URL);
  const sql = postgres(process.env.DATABASE_URL!);
  
  try {
    const users = await sql`SELECT id, full_name, role FROM users ORDER BY created_at DESC LIMIT 5`;
    console.log("Recent uses:", users);
    
    const reqs = await sql`SELECT * FROM vendor_requests ORDER BY created_at DESC LIMIT 5`;
    console.log("Recent vendor requests:", reqs);
  } catch (err) {
    console.error("Failed to query table:", err);
  } finally {
    await sql.end();
  }
}

main();

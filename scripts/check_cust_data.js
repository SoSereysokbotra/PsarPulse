require('dotenv').config();
const postgres = require('postgres');
const sql = postgres(process.env.DATABASE_URL);

async function run() {
  try {
    const res = await sql`SELECT id, name, total_spent FROM vendor_customers`;
    console.log('--- DATA ---');
    console.log(res);
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}
run();

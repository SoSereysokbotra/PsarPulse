require('dotenv').config();
const postgres = require('postgres');
const sql = postgres(process.env.DATABASE_URL);

async function run() {
  try {
    console.log('--- CUSTOMERS ---');
    const customers = await sql`SELECT id, name, total_spent, points FROM vendor_customers`;
    console.log(customers);
    
    console.log('\n--- VENDORS ---');
    const vendors = await sql`SELECT id, name FROM vendors`;
    console.log(vendors);
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

run();

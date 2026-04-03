require('dotenv').config();
const postgres = require('postgres');
const sql = postgres(process.env.DATABASE_URL);

async function run() {
  try {
    const goals = await sql`SELECT * FROM vendor_goals`;
    console.log('--- GOALS TABLE CONTENT ---');
    console.log(JSON.stringify(goals, null, 2));
    
    const salesColumns = await sql`SELECT column_name FROM information_schema.columns WHERE table_name = 'vendor_sales'`;
    console.log('--- SALES TABLE COLUMNS ---');
    console.log(JSON.stringify(salesColumns.map(c => c.column_name), null, 2));
  } catch (err) {
    console.error('Check failed:', err);
  } finally {
    process.exit(0);
  }
}

run();

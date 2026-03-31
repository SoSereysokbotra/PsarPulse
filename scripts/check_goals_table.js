require('dotenv').config();
const postgres = require('postgres');
const sql = postgres(process.env.DATABASE_URL);

async function run() {
  try {
    const res = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'vendor_goals';
    `;
    console.log(JSON.stringify(res, null, 2));
  } catch (err) {
    console.error('Check failed:', err);
  } finally {
    process.exit(0);
  }
}

run();

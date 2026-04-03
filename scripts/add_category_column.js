require('dotenv').config();
const postgres = require('postgres');
const sql = postgres(process.env.DATABASE_URL);

async function run() {
  try {
    console.log('Starting manual migration to add category column to vendor_sales...');
    
    // Check if column exists first (postgres way)
    const columnExists = await sql`
      SELECT count(*) 
      FROM information_schema.columns 
      WHERE table_name = 'vendor_sales' AND column_name = 'category';
    `;

    if (columnExists[0].count === '0') {
      console.log('Adding "category" column...');
      await sql`ALTER TABLE vendor_sales ADD COLUMN category VARCHAR(100);`;
      console.log('Column "category" added successfully!');
    } else {
      console.log('Column "category" already exists.');
    }

  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    process.exit(0);
  }
}

run();

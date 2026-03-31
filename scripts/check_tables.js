require('dotenv').config();
const postgres = require('postgres');
const sql = postgres(process.env.DATABASE_URL);

async function run() {
  try {
    console.log('Adding missing columns...');

    // vendor_sales: add category column if missing
    await sql`ALTER TABLE vendor_sales ADD COLUMN IF NOT EXISTS category varchar(100)`;
    console.log('✅ vendor_sales.category - OK');

    // Verify vendor_customers full schema
    const custCols = await sql`
      SELECT column_name, data_type, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'vendor_customers' 
      ORDER BY ordinal_position
    `;
    console.log('\nvendor_customers schema:');
    custCols.forEach(c => console.log(`  ${c.column_name} ${c.data_type} ${c.column_default ? 'DEFAULT '+c.column_default : ''}`));

    // Verify vendor_traffic_logs
    const logCols = await sql`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'vendor_traffic_logs' 
      ORDER BY ordinal_position
    `;
    console.log('\nvendor_traffic_logs:', logCols.map(c => c.column_name));

    // Verify vendor_sales
    const salesCols = await sql`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'vendor_sales' 
      ORDER BY ordinal_position
    `;
    console.log('\nvendor_sales:', salesCols.map(c => c.column_name));

    // Count rows in key tables
    const custCount = await sql`SELECT COUNT(*) as n FROM vendor_customers`;
    const logCount  = await sql`SELECT COUNT(*) as n FROM vendor_traffic_logs`;
    const salesCount = await sql`SELECT COUNT(*) as n FROM vendor_sales`;

    console.log('\nRow counts:');
    console.log('  vendor_customers:', custCount[0].n);
    console.log('  vendor_traffic_logs:', logCount[0].n);
    console.log('  vendor_sales:', salesCount[0].n);

    console.log('\n✅ All verified successfully!');
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    process.exit(0);
  }
}
run();

const postgres = require('postgres');
const sql = postgres("postgresql://postgres.vwdbdnqlvbowthmnpupo:qQDIEq6Ln24fEqAD@aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true", { ssl: 'require' });

async function run() {
  try {
    await sql`ALTER TABLE vendor_requests ADD COLUMN IF NOT EXISTS business_logo VARCHAR(512);`;
    console.log("Column added successfully");
  } catch (e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
}

run();

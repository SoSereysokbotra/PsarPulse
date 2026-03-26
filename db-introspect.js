const postgres = require('postgres');
const fs = require('fs');

const sql = postgres("postgresql://postgres.vwdbdnqlvbowthmnpupo:qQDIEq6Ln24fEqAD@aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true", { ssl: 'require' });

async function introspect() {
  try {
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    
    let result = { tables: tables.map(r => r.table_name), schemas: {} };

    for (const table of result.tables) {
      const columns = await sql`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = ${table}
      `;
      result.schemas[table] = columns.map(c => ({ column: c.column_name, type: c.data_type }));
    }
    
    fs.writeFileSync('tables.json', JSON.stringify(result, null, 2));
    console.log("Done writing tables.json");
  } catch (e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
}

introspect();

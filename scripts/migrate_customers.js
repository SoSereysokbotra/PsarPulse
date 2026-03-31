require('dotenv').config();
const postgres = require('postgres');
const sql = postgres(process.env.DATABASE_URL);

async function run() {
  console.log('🚀 Running vendor tables migration...\n');

  try {
    // 1. vendor_sales
    await sql`
      CREATE TABLE IF NOT EXISTS vendor_sales (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        vendor_id uuid NOT NULL REFERENCES vendors(id) ON DELETE cascade,
        amount numeric(12,2) NOT NULL,
        method varchar(50) NOT NULL,
        items text,
        category varchar(100),
        created_at timestamp DEFAULT now() NOT NULL
      )
    `;
    console.log('✅ vendor_sales');

    // Add category if missing on existing table
    await sql`ALTER TABLE vendor_sales ADD COLUMN IF NOT EXISTS category varchar(100)`;
    console.log('✅ vendor_sales.category');

    // 2. vendor_expenses
    await sql`
      CREATE TABLE IF NOT EXISTS vendor_expenses (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        vendor_id uuid NOT NULL REFERENCES vendors(id) ON DELETE cascade,
        amount numeric(12,2) NOT NULL,
        category varchar(100) NOT NULL,
        description text,
        expense_date timestamp DEFAULT now() NOT NULL,
        created_at timestamp DEFAULT now() NOT NULL
      )
    `;
    console.log('✅ vendor_expenses');

    // 3. vendor_customers
    await sql`
      CREATE TABLE IF NOT EXISTS vendor_customers (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        vendor_id uuid NOT NULL REFERENCES vendors(id) ON DELETE cascade,
        name varchar(255) NOT NULL,
        phone varchar(20),
        email varchar(255),
        total_spent numeric(12,2) DEFAULT 0,
        points integer DEFAULT 0,
        last_visit timestamp,
        created_at timestamp DEFAULT now() NOT NULL
      )
    `;
    console.log('✅ vendor_customers');

    // 4. vendor_traffic_logs
    await sql`
      CREATE TABLE IF NOT EXISTS vendor_traffic_logs (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        vendor_id uuid NOT NULL REFERENCES vendors(id) ON DELETE cascade,
        count integer NOT NULL,
        status varchar(50) NOT NULL,
        created_at timestamp DEFAULT now() NOT NULL
      )
    `;
    console.log('✅ vendor_traffic_logs');

    // 5. vendor_goals
    await sql`
      CREATE TABLE IF NOT EXISTS vendor_goals (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        vendor_id uuid NOT NULL REFERENCES vendors(id) ON DELETE cascade,
        target_amount numeric(10,2) NOT NULL,
        type varchar(50) DEFAULT 'daily_revenue' NOT NULL,
        is_active boolean DEFAULT true,
        created_at timestamp DEFAULT now() NOT NULL,
        updated_at timestamp DEFAULT now() NOT NULL
      )
    `;
    console.log('✅ vendor_goals');

    // 6. vendor_inventory
    await sql`
      CREATE TABLE IF NOT EXISTS vendor_inventory (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        vendor_id uuid NOT NULL REFERENCES vendors(id) ON DELETE cascade,
        name varchar(255) NOT NULL,
        khmer_name varchar(255),
        price numeric(10,2) NOT NULL,
        stock integer DEFAULT 0 NOT NULL,
        threshold integer DEFAULT 10 NOT NULL,
        status varchar(50) DEFAULT 'good',
        category varchar(100),
        created_at timestamp DEFAULT now() NOT NULL,
        updated_at timestamp DEFAULT now() NOT NULL
      )
    `;
    console.log('✅ vendor_inventory');

    // 7. vendor_daily_reports
    await sql`
      CREATE TABLE IF NOT EXISTS vendor_daily_reports (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        vendor_id uuid NOT NULL REFERENCES vendors(id) ON DELETE cascade,
        report_date timestamp NOT NULL,
        total_sales numeric(12,2) NOT NULL,
        total_expenses numeric(12,2) NOT NULL,
        net_profit numeric(12,2) NOT NULL,
        is_locked integer DEFAULT 0,
        created_at timestamp DEFAULT now() NOT NULL
      )
    `;
    console.log('✅ vendor_daily_reports');

    // Verify all tables
    console.log('\n📋 Verifying...');
    const found = await sql`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN (
        'vendor_customers','vendor_traffic_logs','vendor_sales',
        'vendor_expenses','vendor_goals','vendor_inventory','vendor_daily_reports'
      )
      ORDER BY table_name
    `;
    console.log('Tables found:', found.map(t => t.table_name));

    const cols = await sql`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'vendor_customers' 
      ORDER BY ordinal_position
    `;
    console.log('vendor_customers columns:', cols.map(c => c.column_name));

    console.log('\n🎉 Migration complete!');
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    process.exit(0);
  }
}

run();

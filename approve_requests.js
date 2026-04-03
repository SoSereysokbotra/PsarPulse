const postgres = require('postgres');
const sql = postgres("postgresql://postgres.vwdbdnqlvbowthmnpupo:qQDIEq6Ln24fEqAD@aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true", { ssl: 'require' });

async function run() {
  try {
    // 1. Get pending requests
    const pendingRequests = await sql`SELECT * FROM vendor_requests WHERE status = 'pending'`;
    console.log(`Found ${pendingRequests.length} pending requests.`);

    if (pendingRequests.length === 0) {
      console.log("No pending requests to approve.");
      process.exit(0);
    }

    // 2. Ensure a free plan exists
    let plans = await sql`SELECT * FROM vendor_plans WHERE name = 'free'`;
    let freePlanId;
    if (plans.length === 0) {
      const inserted = await sql`
        INSERT INTO vendor_plans (name, description, monthly_price, priority) 
        VALUES ('free', 'Default free plan', 0, 1) RETURNING id
      `;
      freePlanId = inserted[0].id;
    } else {
      freePlanId = plans[0].id;
    }

    // 3. Approve requests & Insert vendors
    for (const req of pendingRequests) {
      await sql`UPDATE vendor_requests SET status = 'approved', reviewed_at = NOW() WHERE id = ${req.id}`;
      
      // Update user role to vendor
      await sql`UPDATE users SET role = 'vendor' WHERE id = ${req.user_id}`;

      // Insert vendor record if not exists
      const existingVendor = await sql`SELECT * FROM vendors WHERE user_id = ${req.user_id}`;
      if (existingVendor.length === 0) {
        await sql`
          INSERT INTO vendors (
            user_id, business_name, business_email, business_phone, 
            business_address, business_description, category, 
            business_logo, cover_image, plan_id, 
            subscription_status, status, is_verified
          ) VALUES (
            ${req.user_id}, ${req.business_name}, ${req.business_email}, ${req.business_phone},
            ${req.business_address}, ${req.business_description}, ${req.business_category},
            ${req.business_logo}, ${req.business_logo}, ${freePlanId},
            'active', 'active', true
          )
        `;
        console.log(`Approved and created vendor for ${req.business_name}`);
      }
    }

    // 4. Also ensure any existing vendors have is_verified = true so they show up
    await sql`UPDATE vendors SET is_verified = true, status = 'active'`;
    console.log("Updated all existing vendors to be verified and active.");
    
  } catch (e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
}

run();

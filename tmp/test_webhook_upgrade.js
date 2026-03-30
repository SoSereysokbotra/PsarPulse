
const postgres = require('postgres');
const dotenv = require('dotenv');
dotenv.config();

const sql = postgres(process.env.DATABASE_URL);

async function test() {
  const userId = 'c5f667c6-1038-4981-8400-8fcd54697dd3';
  const transactionId = 'TEST_' + Date.now();

  try {
    console.log(`Starting test for userId: ${userId}`);

    // 1. Create a dummy transaction with vendorId = null
    await sql`
      INSERT INTO payment_transactions (
        transaction_id, provider, status, user_id, vendor_id, 
        plan_code, billing_cycle, method, amount, currency, 
        description, created_at, updated_at
      ) VALUES (
        ${transactionId}, 'bakong', 'pending', ${userId}, NULL, 
        'pro', 'monthly', 'bakong', 0.01, 'USD', 
        'Test Subscription', NOW(), NOW()
      )
    `;
    console.log(`Created transaction: ${transactionId}`);

    // 2. Call the webhook API (since it's an internal test, I'll just check if it's reachable or simulate the payload)
    // Actually, I'll just call the webhook via fetch if possible, or just simulate the database update if I want to test the logic I just wrote.
    // To test the logic I just wrote in next.js, I should ideally trigger the actual endpoint.
    
    const webhookUrl = 'http://localhost:3000/api/bakong/webhook';
    const payload = {
      transactionId: transactionId,
      status: 'SUCCESS'
    };

    console.log(`Calling webhook: ${webhookUrl}`);
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    console.log('Webhook response:', JSON.stringify(result, null, 2));

    // 3. Verify the changes in the DB
    const [user] = await sql`SELECT role FROM users WHERE id = ${userId}`;
    const [vendor] = await sql`SELECT id, business_name FROM vendors WHERE user_id = ${userId}`;
    const subscriptions = await sql`SELECT id, status FROM vendor_subscriptions WHERE vendor_id = ${vendor?.id}`;

    console.log('User role:', user?.role);
    console.log('Vendor record:', JSON.stringify(vendor, null, 2));
    console.log('Subscriptions:', JSON.stringify(subscriptions, null, 2));

    if (user?.role === 'vendor' && vendor && subscriptions.some(s => s.status === 'active')) {
      console.log('SUCCESS: Customer upgraded to vendor and records created.');
    } else {
      console.log('FAILURE: Verification failed.');
    }

    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

test();

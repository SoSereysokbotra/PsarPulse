
const postgres = require('postgres');
const dotenv = require('dotenv');
dotenv.config();

const sql = postgres(process.env.DATABASE_URL);

async function check() {
  try {
    const users = await sql`SELECT id, email, role FROM users WHERE role = 'customer' LIMIT 1`;
    console.log(JSON.stringify(users, null, 2));
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}
check();

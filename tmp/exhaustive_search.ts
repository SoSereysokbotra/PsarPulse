import * as dotenv from "dotenv";
dotenv.config();

async function exhaustiveSearch() {
  try {
    const { db } = await import("../lib/db");
    const { users } = await import("../lib/db/schema");
    const { sql } = await import("drizzle-orm");

    const email = "noeun.tithearin25@kit.edu.kh".trim().toLowerCase();
    
    console.log(`Searching for: "${email}"`);

    const result = await db.select().from(users).where(sql`lower(email) = ${email}`);
    
    console.log(`Found ${result.length} matches in 'users' table.`);
    if (result.length > 0) {
      console.log(JSON.stringify(result, null, 2));
    } else {
      console.log("No exact match found. Listing all emails currently in DB for manual inspection:");
      const allEmails = await db.select({ email: users.email }).from(users);
      console.log(allEmails.map(u => u.email));
    }

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

exhaustiveSearch();

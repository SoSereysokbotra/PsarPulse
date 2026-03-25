import { db } from "../lib/db";
import { users } from "../lib/db/schema";
import { desc } from "drizzle-orm";

async function checkUsers() {
  try {
    const allUsers = await db.select({
      id: users.id,
      fullName: users.fullName,
      email: users.email,
      role: users.role,
      createdAt: users.createdAt
    }).from(users).orderBy(desc(users.createdAt)).limit(10);
    console.log("Recent Users:");
    console.log(JSON.stringify(allUsers, null, 2));
    process.exit(0);
  } catch (error) {
    console.error("Error checking users:", error);
    process.exit(1);
  }
}

checkUsers();

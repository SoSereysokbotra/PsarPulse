import { db } from "../lib/db";
import { users } from "../lib/db/schema/users.schema";
import { eq } from "drizzle-orm";

async function checkUser() {
  try {
    const allUsers = await db.select().from(users);
    console.log("Current Users in DB:");
    allUsers.forEach(u => {
      console.log(`ID: ${u.id}, Name: ${u.fullName}, Email: ${u.email}, Avatar: ${(u as any).avatarUrl || (u as any).avatar_url}`);
    });
  } catch (error) {
    console.error("Error fetching users:", error);
  }
  process.exit(0);
}

checkUser().catch(err => {
  console.error(err);
  process.exit(1);
});

import * as dotenv from "dotenv";
dotenv.config();

async function finalVerify() {
  try {
    const { db } = await import("../lib/db");
    const { users, admins } = await import("../lib/db/schema");
    const { eq } = await import("drizzle-orm");

    const email = "noeun.tithearin25@kit.edu.kh";
    const [user] = await db.select().from(users).where(eq(users.email, email));

    console.log("User Data:");
    console.log(JSON.stringify(user, null, 2));

    if (user) {
      const [admin] = await db.select().from(admins).where(eq(admins.userId, user.id));
      console.log("\nAdmin Permissions:");
      console.log(JSON.stringify(admin, null, 2));
    }

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

finalVerify();

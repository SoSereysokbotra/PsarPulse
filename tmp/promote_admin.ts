import * as dotenv from "dotenv";
dotenv.config();

async function promoteToAdmin(email: string) {
  try {
    console.log(`Promoting user with email: ${email} to admin...`);

    // Dynamic imports to ensure dotenv.config() has run
    const { db } = await import("../lib/db");
    const { users, admins } = await import("../lib/db/schema");
    const { eq } = await import("drizzle-orm");

    // 1. Find the user
    const [user] = await db.select().from(users).where(eq(users.email, email));

    if (!user) {
      console.error(`User with email ${email} not found.`);
      return;
    }

    console.log(`Found user: ${user.fullName} (ID: ${user.id})`);

    // 2. Update user role
    await db
      .update(users)
      .set({ role: "admin", isVerified: true, status: "active" })
      .where(eq(users.id, user.id));

    console.log(`Updated user role to 'admin'.`);

    // 3. Check if admin entry already exists
    const [existingAdmin] = await db
      .select()
      .from(admins)
      .where(eq(admins.userId, user.id));

    if (!existingAdmin) {
      // 4. Create admin entry
      await db.insert(admins).values({
        userId: user.id,
        role: "admin",
        canManageVendors: true,
        canManageUsers: true,
        canManagePlans: true,
        canManageBilling: true,
        canViewAnalytics: true,
      });
      console.log(`Created entry in 'admins' table.`);
    } else {
      console.log(`User is already in the 'admins' table.`);
    }

    console.log(`Success! User ${email} is now an admin.`);
  } catch (error) {
    console.error("Error promoting user to admin:", error);
  }
}

// Get email from command line argument
const email = process.argv[2];
if (!email) {
  console.error("Please provide an email address as an argument.");
  process.exit(1);
}

promoteToAdmin(email);

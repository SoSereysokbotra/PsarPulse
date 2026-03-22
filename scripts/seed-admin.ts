import { config } from "dotenv";
import { resolve } from "path";
// Load .env
config({ path: resolve(process.cwd(), ".env") });

import { migrationClient } from "../lib/db";
import { drizzle } from "drizzle-orm/postgres-js";
import { users, admins } from "../lib/db/schema";
import { HashUtil } from "../lib/auth/utils/hash.util";
import { eq } from "drizzle-orm";

const db = drizzle(migrationClient, { schema: { users, admins } });

async function seedAdmin() {
  try {
    const email = "superadmin@psarpulse.com";
    const password = "SecureAdmin123!";
    const fullName = "Super Administrator";

    // Check if exists
    const existing = await db.select().from(users).where(eq(users.email, email));
    
    if (existing.length > 0) {
      console.log(`Admin user ${email} already exists!`);
      process.exit(0);
    }

    // Create user
    const passwordHash = await HashUtil.hashPassword(password);
    console.log("Creating admin user...");
    
    const [user] = await db.insert(users).values({
      email,
      fullName,
      passwordHash,
      role: "super_admin",
      isVerified: true,
      status: "active",
    }).returning();

    console.log(`Created user with ID: ${user.id}`);

    // Create admins record
    const [admin] = await db.insert(admins).values({
      userId: user.id,
      role: "super_admin",
      canManageVendors: true,
      canManageUsers: true,
      canManagePlans: true,
      canManageBilling: true,
      canViewAnalytics: true,
    }).returning();

    console.log(`Created admin record with ID: ${admin.id}`);
    console.log("\n==================================");
    console.log("Admin seeded successfully!");
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log("==================================\n");
    
    process.exit(0);
  } catch (error) {
    console.error("Failed to seed admin:", error);
    process.exit(1);
  }
}

seedAdmin();

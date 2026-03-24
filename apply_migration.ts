import "dotenv/config";
import { sql } from "drizzle-orm";
// We need to import db
import { db } from "./lib/db/index";

async function run() {
  try {
    console.log("Starting manual migration...");

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "oauth_accounts" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action,
        "provider" varchar(50) NOT NULL,
        "provider_user_id" varchar(255) NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL
      );
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "oauth_states" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "state" varchar(255) NOT NULL,
        "code_verifier" varchar(255),
        "provider" varchar(50) NOT NULL,
        "redirect_uri" varchar(255) NOT NULL,
        "expires_at" timestamp NOT NULL,
        "used" boolean DEFAULT false NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL,
        CONSTRAINT "oauth_states_state_unique" UNIQUE("state")
      );
    `);
    
    await db.execute(sql`
        ALTER TABLE "users" ALTER COLUMN "password_hash" DROP NOT NULL;
    `);

    console.log("Migration complete!");
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    process.exit(0);
  }
}

run();

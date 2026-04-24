/**
 * apply-oauth-migration.ts
 *
 * This script:
 * 1. Seeds Drizzle's __drizzle_migrations table for migrations 0-5
 *    (these were applied directly in Supabase and not tracked by Drizzle).
 * 2. Applies migration 0006_oauth_tables.sql which creates:
 *    - oauth_accounts table
 *    - oauth_states table
 *    - Makes password_hash nullable (for OAuth-only users)
 *    - Adds avatar_url column to users
 */

import postgres from "postgres";
import { config } from "dotenv";
import { readFileSync } from "fs";
import { resolve } from "path";

config({ path: ".env" });

const connectionString =
  process.env.DATABASE_DIRECT_URL || process.env.DATABASE_URL || "";

if (!connectionString) {
  console.error("❌ No database connection string found in .env");
  process.exit(1);
}

const sql = postgres(connectionString, { max: 1, ssl: "require" });

// Migrations that were already applied directly (outside of Drizzle tracking)
const alreadyApplied = [
  { hash: "0000_dapper_amazoness", created_at: 1774175880024 },
  { hash: "0001_sticky_stark_industries", created_at: 1774186273282 },
  { hash: "0002_init_vendor_tables", created_at: 1774490639361 },
  { hash: "0003_payment_transactions", created_at: 1774453200000 },
  { hash: "0004_thick_shadowcat", created_at: 1774570416366 },
  { hash: "0005_sleepy_demogoblin", created_at: 1774839663587 },
];

async function main() {
  try {
    console.log("🔗 Connected to database via session mode pooler...\n");

    // Step 1: Ensure drizzle schema and migrations table exist
    await sql`CREATE SCHEMA IF NOT EXISTS drizzle`;
    await sql`
      CREATE TABLE IF NOT EXISTS drizzle.__drizzle_migrations (
        id SERIAL PRIMARY KEY,
        hash TEXT NOT NULL,
        created_at BIGINT
      )
    `;
    console.log("✅ Drizzle migration schema ready");

    // Step 2: Seed migration history for migrations 0-5
    for (const migration of alreadyApplied) {
      const existing = await sql`
        SELECT id FROM drizzle.__drizzle_migrations WHERE hash = ${migration.hash}
      `;
      if (existing.length === 0) {
        await sql`
          INSERT INTO drizzle.__drizzle_migrations (hash, created_at)
          VALUES (${migration.hash}, ${migration.created_at})
        `;
        console.log(`  📋 Recorded: ${migration.hash}`);
      } else {
        console.log(`  ⏭️  Already tracked: ${migration.hash}`);
      }
    }

    // Step 3: Check if migration 0006 was already applied
    const migration6Exists = await sql`
      SELECT id FROM drizzle.__drizzle_migrations 
      WHERE hash = '0006_oauth_tables'
    `;

    if (migration6Exists.length > 0) {
      console.log("\n⏭️  Migration 0006_oauth_tables already applied, skipping.");
      return;
    }

    // Step 4: Apply the OAuth tables migration SQL
    console.log("\n🚀 Applying migration 0006_oauth_tables...");
    const migrationSQL = readFileSync(
      resolve("lib/db/migrations/0006_oauth_tables.sql"),
      "utf-8"
    );

    // Split on the drizzle breakpoint marker and execute each statement
    const statements = migrationSQL
      .split("--> statement-breakpoint")
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.startsWith("--"));

    for (const statement of statements) {
      try {
        await sql.unsafe(statement);
        console.log(`  ✅ Executed: ${statement.substring(0, 60).replace(/\n/g, " ")}...`);
      } catch (err: any) {
        // IF NOT EXISTS guards handle duplicate column/table gracefully
        if (
          err.code === "42P07" || // relation already exists
          err.code === "42701"    // column already exists
        ) {
          console.log(`  ⚠️  Already exists (skipped): ${err.message}`);
        } else {
          throw err;
        }
      }
    }

    // Step 5: Record migration 0006 as applied
    await sql`
      INSERT INTO drizzle.__drizzle_migrations (hash, created_at)
      VALUES ('0006_oauth_tables', ${Date.now()})
    `;

    console.log("\n✅ Migration 0006_oauth_tables applied successfully!");
    console.log("   • oauth_accounts table created");
    console.log("   • oauth_states table created");
    console.log("   • users.password_hash is now nullable");
    console.log("   • users.avatar_url column added");

  } catch (error: any) {
    console.error("\n❌ Migration failed:", error?.message || error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

main();

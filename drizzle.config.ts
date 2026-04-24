import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";

config({ path: ".env" });

export default defineConfig({
  schema: "./lib/db/schema/index.ts",
  out: "./lib/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    // Use direct (non-pooled) URL for DDL — pgBouncer doesn't support it
    url: process.env.DATABASE_DIRECT_URL || process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
});

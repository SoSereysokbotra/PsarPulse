import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const connectionString = process.env.DATABASE_URL;

// Create a postgres client for migrations
export const migrationClient = postgres(connectionString, { max: 1 });

// Singleton pattern to prevent multiple instances in development
const globalForDb = globalThis as unknown as {
  conn: postgres.Sql | undefined;
};

const queryClient = globalForDb.conn ?? postgres(connectionString);
if (process.env.NODE_ENV !== "production") globalForDb.conn = queryClient;

export const db = drizzle(queryClient, { schema });

// Export schema and types for convenience
export { schema };
export type Database = typeof db;

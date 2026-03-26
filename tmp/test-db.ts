import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../lib/db/schema";
import { eq } from "drizzle-orm";
import dotenv from "dotenv";

dotenv.config();

async function test() {
  const connectionString = process.env.DATABASE_URL!;
  console.log("Connecting to:", connectionString.split("@")[1]); // Mask sensitive part
  
  const client = postgres(connectionString);
  const db = drizzle(client, { schema });

  try {
    console.log("Testing DB connection...");
    const firstVendor = await db.query.vendors.findFirst();
    if (!firstVendor) {
      console.log("No vendors found in DB.");
      return;
    }
    console.log("Found vendor:", firstVendor.id);

    console.log("Inserting test sale...");
    const [sale] = await db.insert(schema.vendorSales).values({
      vendorId: firstVendor.id,
      amount: "100.00",
      method: "Cash",
      items: "Test Item",
    }).returning();
    console.log("Inserted sale:", sale.id);

    const check = await db.query.vendorSales.findFirst({ where: eq(schema.vendorSales.id, sale.id) });
    console.log("Check fetch:", check ? "Found" : "Not Found");

    // Cleanup
    await db.delete(schema.vendorSales).where(eq(schema.vendorSales.id, sale.id));
    console.log("Deleted test sale.");

  } catch (e) {
    console.error("DB Test Failed:", e);
  } finally {
    await client.end();
  }
}

test();

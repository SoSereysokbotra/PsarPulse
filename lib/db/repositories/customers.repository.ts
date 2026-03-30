import { eq, desc } from "drizzle-orm";
import { db } from "../index";
import { vendorCustomers } from "../schema/customers.schema";

export class CustomersRepository {
  static async create(data: typeof vendorCustomers.$inferInsert) {
    const [result] = await db.insert(vendorCustomers).values(data).returning();
    return result;
  }

  static async findByVendorId(vendorId: string) {
    return await db.query.vendorCustomers.findMany({
      where: eq(vendorCustomers.vendorId, vendorId),
      orderBy: [desc(vendorCustomers.createdAt)],
    });
  }

  static async findById(id: string) {
    return await db.query.vendorCustomers.findFirst({
      where: eq(vendorCustomers.id, id),
    });
  }

  static async update(id: string, data: Partial<typeof vendorCustomers.$inferInsert>) {
    const [result] = await db
      .update(vendorCustomers)
      .set(data)
      .where(eq(vendorCustomers.id, id))
      .returning();
    return result;
  }

  static async delete(id: string) {
    const [result] = await db
      .delete(vendorCustomers)
      .where(eq(vendorCustomers.id, id))
      .returning();
    return result;
  }
}

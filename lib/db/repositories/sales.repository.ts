import { eq, desc, and } from "drizzle-orm";
import { db } from "../index";
import { vendorSales } from "../schema/sales.schema";

export class SalesRepository {
  static async create(data: typeof vendorSales.$inferInsert) {
    const [result] = await db.insert(vendorSales).values(data).returning();
    return result;
  }

  static async findByVendorId(vendorId: string) {
    return await db.query.vendorSales.findMany({
      where: eq(vendorSales.vendorId, vendorId),
      orderBy: [desc(vendorSales.createdAt)],
    });
  }

  static async findById(id: string) {
    return await db.query.vendorSales.findFirst({
      where: eq(vendorSales.id, id),
    });
  }

  static async delete(id: string, vendorId: string) {
    const [result] = await db
      .delete(vendorSales)
      .where(and(eq(vendorSales.id, id), eq(vendorSales.vendorId, vendorId)))
      .returning();
    return result;
  }
}

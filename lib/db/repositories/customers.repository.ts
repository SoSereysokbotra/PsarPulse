import { eq, desc, and, sql } from "drizzle-orm";
import { db } from "../index";
import { vendorCustomers, vendorTrafficLogs } from "../schema/customers.schema";

export class CustomersRepository {
  static async create(data: typeof vendorCustomers.$inferInsert) {
    const [result] = await db.insert(vendorCustomers).values(data).returning();
    return result;
  }

  static async createTrafficLog(data: typeof vendorTrafficLogs.$inferInsert) {
    const [result] = await db.insert(vendorTrafficLogs).values(data).returning();
    return result;
  }

  static async findByVendorId(vendorId: string) {
    return await db.query.vendorCustomers.findMany({
      where: eq(vendorCustomers.vendorId, vendorId),
      orderBy: [desc(vendorCustomers.createdAt)],
    });
  }

  static async findTrafficLogsByVendorId(vendorId: string) {
    return await db.query.vendorTrafficLogs.findMany({
      where: eq(vendorTrafficLogs.vendorId, vendorId),
      orderBy: [desc(vendorTrafficLogs.createdAt)],
    });
  }

  static async findById(id: string) {
    return await db.query.vendorCustomers.findFirst({
      where: eq(vendorCustomers.id, id),
    });
  }

  static async updatePoints(id: string, points: number) {
    const [result] = await db
      .update(vendorCustomers)
      .set({ points })
      .where(eq(vendorCustomers.id, id))
      .returning();
    return result;
  }

  static async getAvgLTV(vendorId: string) {
    const result = await db
      .select({
        avgLtv: sql<string>`avg(${vendorCustomers.totalSpent})`,
      })
      .from(vendorCustomers)
      .where(eq(vendorCustomers.vendorId, vendorId));

    return parseFloat(result[0]?.avgLtv || "0");
  }

  static async findTopCustomers(vendorId: string, limit: number = 3) {
    return await db.query.vendorCustomers.findMany({
      where: eq(vendorCustomers.vendorId, vendorId),
      orderBy: [desc(vendorCustomers.totalSpent)],
      limit,
    });
  }

  static async countByVendorId(vendorId: string): Promise<number> {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(vendorCustomers)
      .where(eq(vendorCustomers.vendorId, vendorId));
    return Number(result[0]?.count || 0);
  }

  static async update(id: string, vendorId: string, data: Partial<typeof vendorCustomers.$inferInsert>) {
    const [result] = await db
      .update(vendorCustomers)
      .set(data)
      .where(and(eq(vendorCustomers.id, id), eq(vendorCustomers.vendorId, vendorId)))
      .returning();
    return result;
  }

  static async delete(id: string, vendorId: string) {
    const [result] = await db
      .delete(vendorCustomers)
      .where(and(eq(vendorCustomers.id, id), eq(vendorCustomers.vendorId, vendorId)))
      .returning();
    return result;
  }

  static async deleteTrafficLog(id: string, vendorId: string) {
    const [result] = await db
      .delete(vendorTrafficLogs)
      .where(and(eq(vendorTrafficLogs.id, id), eq(vendorTrafficLogs.vendorId, vendorId)))
      .returning();
    return result;
  }
}



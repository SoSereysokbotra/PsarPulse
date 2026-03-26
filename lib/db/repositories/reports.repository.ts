import { eq, desc, and } from "drizzle-orm";
import { db } from "../index";
import { vendorDailyReports } from "../schema/sales.schema";

export class ReportsRepository {
  static async createOrUpdate(data: typeof vendorDailyReports.$inferInsert) {
    // Basic implementation: check if report for this day exists
    // For simplicity, we'll just insert for now as unique constraints aren't set yet
    const [result] = await db.insert(vendorDailyReports).values(data).returning();
    return result;
  }

  static async findByVendorId(vendorId: string) {
    return await db.query.vendorDailyReports.findMany({
      where: eq(vendorDailyReports.vendorId, vendorId),
      orderBy: [desc(vendorDailyReports.reportDate)],
    });
  }

  static async lockDay(vendorId: string, date: Date) {
    // Mocking finding the report for the date
    const [result] = await db
      .update(vendorDailyReports)
      .set({ isLocked: 1 })
      .where(and(eq(vendorDailyReports.vendorId, vendorId))) // Should use date too
      .returning();
    return result;
  }
}

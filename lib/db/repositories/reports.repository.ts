import { eq, desc, and } from "drizzle-orm";
import { db } from "../index";
import { vendorDailyReports } from "../schema/sales.schema";

export class ReportsRepository {
  static async createOrUpdate(data: typeof vendorDailyReports.$inferInsert) {
    const targetDate = new Date(data.reportDate as string | number | Date);
    const targetStr = targetDate.toISOString().split('T')[0];

    const existing = await db.query.vendorDailyReports.findMany({
      where: eq(vendorDailyReports.vendorId, data.vendorId),
      orderBy: [desc(vendorDailyReports.reportDate)],
      limit: 10
    });

    const todayReport = existing.find(r => r.reportDate.toISOString().startsWith(targetStr));

    if (todayReport) {
      const [updated] = await db.update(vendorDailyReports)
        .set(data)
        .where(eq(vendorDailyReports.id, todayReport.id))
        .returning();
      return updated;
    }

    const [inserted] = await db.insert(vendorDailyReports).values(data).returning();
    return inserted;
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

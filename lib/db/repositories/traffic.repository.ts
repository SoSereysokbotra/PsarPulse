import { eq, desc, and, gte, sql } from "drizzle-orm";
import { db } from "../index";
import { vendorTrafficLogs } from "../schema/customers.schema";

export class TrafficRepository {
  static async create(data: typeof vendorTrafficLogs.$inferInsert) {
    const [result] = await db.insert(vendorTrafficLogs).values(data).returning();
    return result;
  }

  static async findByVendorId(vendorId: string) {
    return await db.query.vendorTrafficLogs.findMany({
      where: eq(vendorTrafficLogs.vendorId, vendorId),
      orderBy: [desc(vendorTrafficLogs.createdAt)],
    });
  }

  static async getTodayTraffic(vendorId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const result = await db
      .select({
        totalCount: sql<number>`sum(${vendorTrafficLogs.count})`,
        logCount: sql<number>`count(*)`,
      })
      .from(vendorTrafficLogs)
      .where(
        and(
          eq(vendorTrafficLogs.vendorId, vendorId),
          gte(vendorTrafficLogs.createdAt, today)
        )
      );

    return {
      totalCount: Number(result[0]?.totalCount || 0),
      logCount: Number(result[0]?.logCount || 0),
    };
  }

  static async getWeeklyTraffic(vendorId: string) {
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);
    last7Days.setHours(0, 0, 0, 0);

    const result = await db
      .select({
        totalCount: sql<number>`sum(${vendorTrafficLogs.count})`,
      })
      .from(vendorTrafficLogs)
      .where(
        and(
          eq(vendorTrafficLogs.vendorId, vendorId),
          gte(vendorTrafficLogs.createdAt, last7Days)
        )
      );

    return Number(result[0]?.totalCount || 0);
  }

  static async getPrevWeeklyTraffic(vendorId: string) {
    const last14Days = new Date();
    last14Days.setDate(last14Days.getDate() - 14);
    last14Days.setHours(0, 0, 0, 0);

    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);
    last7Days.setHours(0, 0, 0, 0);

    const result = await db
      .select({
        totalCount: sql<number>`sum(${vendorTrafficLogs.count})`,
      })
      .from(vendorTrafficLogs)
      .where(
        and(
          eq(vendorTrafficLogs.vendorId, vendorId),
          gte(vendorTrafficLogs.createdAt, last14Days),
          sql`${vendorTrafficLogs.createdAt} < ${last7Days}`
        )
      );

    return Number(result[0]?.totalCount || 0);
  }

  static async getPeakTime(vendorId: string) {
    const result = await db
      .select({
        hour: sql<number>`EXTRACT(HOUR FROM ${vendorTrafficLogs.createdAt})`,
        totalCount: sql<number>`sum(${vendorTrafficLogs.count})`,
      })
      .from(vendorTrafficLogs)
      .where(eq(vendorTrafficLogs.vendorId, vendorId))
      .groupBy(sql`EXTRACT(HOUR FROM ${vendorTrafficLogs.createdAt})`)
      .orderBy(desc(sql`sum(${vendorTrafficLogs.count})`))
      .limit(1);

    if (result.length === 0) return null;
    
    const hour = Number(result[0].hour);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:00 ${ampm}`;
  }

  static async getHourlyPattern(vendorId: string) {
    const result = await db
      .select({
        hour: sql<number>`EXTRACT(HOUR FROM ${vendorTrafficLogs.createdAt})`,
        avgCount: sql<number>`avg(${vendorTrafficLogs.count})`,
        totalLogs: sql<number>`count(*)`,
      })
      .from(vendorTrafficLogs)
      .where(eq(vendorTrafficLogs.vendorId, vendorId))
      .groupBy(sql`EXTRACT(HOUR FROM ${vendorTrafficLogs.createdAt})`)
      .orderBy(sql`EXTRACT(HOUR FROM ${vendorTrafficLogs.createdAt})`);

    return result.map(r => ({
      hour: Number(r.hour),
      avgCount: Number(r.avgCount || 0),
      totalLogs: Number(r.totalLogs || 0),
    }));
  }
}


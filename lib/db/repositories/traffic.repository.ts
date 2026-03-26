import { eq, desc } from "drizzle-orm";
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
}

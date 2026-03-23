import { db } from "@/lib/db";
import { vendorRequests } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export class VendorRequestRepository {
  static async create(data: {
    userId: string;
    businessName: string;
    businessEmail: string;
    businessCategory?: string;
    requiredPlan?: "free" | "pro" | "premium";
    status?: "pending" | "approved" | "rejected";
  }) {
    const result = await db.insert(vendorRequests).values(data).returning();
    return result[0];
  }

  static async findById(id: string) {
    const result = await db
      .select()
      .from(vendorRequests)
      .where(eq(vendorRequests.id, id));
    return result[0];
  }

  static async findAllPending() {
    const result = await db
      .select()
      .from(vendorRequests)
      .where(eq(vendorRequests.status, "pending"));
    return result;
  }

  static async updateStatus(
    id: string,
    status: "approved" | "rejected",
    adminId: string,
    reason?: string
  ) {
    const result = await db
      .update(vendorRequests)
      .set({
        status,
        reviewedBy: adminId,
        reviewedAt: new Date(),
        reasonForRejection: reason,
      })
      .where(eq(vendorRequests.id, id))
      .returning();
    return result[0];
  }
}

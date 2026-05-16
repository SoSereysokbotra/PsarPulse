import { eq, and } from "drizzle-orm";
import { db } from "../index";
import { vendors, vendorPlans, vendorSubscriptions } from "../schema/vendor.schema";

export class VendorRepository {
  /**
   * Find vendor by user ID with plan details
   */
  static async findByUserId(userId: string) {
    return await db.query.vendors.findFirst({
      where: eq(vendors.userId, userId),
      with: {
        plan: true,
        subscriptions: {
          where: eq(vendorSubscriptions.status, "active"),
          with: {
            plan: true,
          },
        },
      },
    });
  }

  /**
   * Get vendor's active subscription
   */
  static async getActiveSubscription(vendorId: string) {
    return await db.query.vendorSubscriptions.findFirst({
      where: and(
        eq(vendorSubscriptions.vendorId, vendorId),
        eq(vendorSubscriptions.status, "active")
      ),
      with: {
        plan: true,
      },
    });
  }

  /**
   * Find all active verified vendors for customer discovery
   */
  static async findAllActive() {
    return await db.query.vendors.findMany({
      where: eq(vendors.status, "active"),
    });
  }
}

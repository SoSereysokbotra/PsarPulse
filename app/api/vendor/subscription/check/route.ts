import { NextRequest, NextResponse } from "next/server";
import { TokenUtil } from "@/lib/auth/utils/token.util";
import { authConfig } from "@/lib/auth/config";
import { VendorRepository } from "@/lib/db/repositories/vendor.repository";
import { db } from "@/lib/db";
import { paymentTransactions } from "@/lib/db/schema";
import { and, eq, gte } from "drizzle-orm";

/**
 * GET /api/vendor/subscription/check
 * Returns the vendor's current plan name and subscription status.
 * Used internally by middleware to enforce plan-based route protection.
 */
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const token = request.cookies.get(authConfig.cookies.accessToken)?.value;
  if (!token) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    const payload = TokenUtil.verifyAccessToken(token);
    if (!payload?.id) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 },
      );
    }

    const vendor = await VendorRepository.findByUserId(payload.id);

    if (!vendor) {
      // Grace period: if the user just completed a payment in the last 60 seconds,
      // grant temporary access while the webhook finishes setting up the vendor record.
      try {
        const gracePeriodStart = new Date(Date.now() - 60_000);
        const [recentPayment] = await db
          .select()
          .from(paymentTransactions)
          .where(
            and(
              eq(paymentTransactions.userId, payload.id),
              eq(paymentTransactions.status, "completed"),
              gte(paymentTransactions.completedAt, gracePeriodStart),
            ),
          )
          .limit(1);

        if (recentPayment) {
          console.log(
            `[SubscriptionCheckAPI] Grace period active for user ${payload.id}, plan: ${recentPayment.planCode}`,
          );
          return NextResponse.json({
            success: true,
            data: {
              planName: recentPayment.planCode,
              subscriptionStatus: "active",
              isVendor: true,
            },
          });
        }
      } catch (graceErr) {
        console.warn("[SubscriptionCheckAPI] Grace period check failed:", graceErr);
      }

      return NextResponse.json(
        {
          success: true,
          data: {
            planName: null,
            subscriptionStatus: null,
            isVendor: false,
          },
        },
        { status: 200 },
      );
    }

    const planName = vendor.plan?.name || "free";
    const subscriptionStatus = vendor.subscriptionStatus || "trial";
    const subscriptionEndsAt = vendor.subscriptionEndsAt;

    console.log(
      `[SubscriptionCheckAPI] Vendor ID: ${vendor.id}, Plan: ${planName}, Status: ${subscriptionStatus}`,
    );

    // Check if the subscription has expired
    const isExpired =
      subscriptionEndsAt && new Date(subscriptionEndsAt) < new Date();
    const effectiveStatus = isExpired ? "expired" : subscriptionStatus;

    return NextResponse.json({
      success: true,
      data: {
        planName,
        subscriptionStatus: effectiveStatus,
        isVendor: true,
      },
    });
  } catch (error) {
    console.error("Subscription check error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}

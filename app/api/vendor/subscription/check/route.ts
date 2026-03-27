import { NextRequest, NextResponse } from "next/server";
import { TokenUtil } from "@/lib/auth/utils/token.util";
import { authConfig } from "@/lib/auth/config";
import { VendorRepository } from "@/lib/db/repositories/vendor.repository";

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

    // Get the plan name from the vendor's current plan
    const planName = vendor.plan?.name || "free";
    const subscriptionStatus = vendor.subscriptionStatus || "trial";
    const subscriptionEndsAt = vendor.subscriptionEndsAt;

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

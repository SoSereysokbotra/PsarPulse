import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { vendors, vendorSubscriptions, vendorRequests, users } from "@/lib/db/schema";
import { eq, sql, and, gte } from "drizzle-orm";
import { jwtVerify } from "jose";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  if (!token) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET!);
    const { payload } = await jwtVerify(token, secret);
    
    if (payload.role !== "admin" && payload.role !== "super_admin") {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    // 1. Total active vendors
    const vendorResults = await db
      .select({ count: sql<number>`count(*)` })
      .from(vendors)
      .where(eq(vendors.status, "active"));
    const activeVendors = vendorResults[0]?.count || 0;

    // 2. Total active subscriptions & revenue
    // We'll calculate total revenue from active subscriptions amount
    const subscriptionResults = await db
      .select({
        count: sql<number>`count(*)`,
        totalRevenue: sql<number>`sum(${vendorSubscriptions.amount})`,
        freeCount: sql<number>`count(case when ${vendorSubscriptions.amount} = 0 then 1 end)`,
        paidCount: sql<number>`count(case when ${vendorSubscriptions.amount} > 0 then 1 end)`,
      })
      .from(vendorSubscriptions)
      .where(eq(vendorSubscriptions.status, "active"));
      
    const activeSubs = subscriptionResults[0]?.count || 0;
    const monthlyRevenue = subscriptionResults[0]?.totalRevenue || 0;

    // We'll also get the breakdown of Pro vs Premium if possible, but let's keep it simple
    // 3. Pending requests
    const pendingResults = await db
      .select({ count: sql<number>`count(*)` })
      .from(vendorRequests)
      .where(eq(vendorRequests.status, "pending"));
    const pendingRequests = pendingResults[0]?.count || 0;

    return NextResponse.json({
      success: true,
      data: {
        activeVendors,
        activeSubs,
        monthlyRevenue,
        pendingRequests,
        subscriptionsBreakdown: {
          free: subscriptionResults[0]?.freeCount || 0,
          paid: subscriptionResults[0]?.paidCount || 0,
        }
      }
    });
  } catch (error) {
    console.error("Failed to fetch admin stats:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

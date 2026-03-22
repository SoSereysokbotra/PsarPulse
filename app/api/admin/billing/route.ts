import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { vendorPlans, vendors, vendorSubscriptions } from "@/lib/db/schema";
import { count, eq } from "drizzle-orm";

async function verifyAdminOrSuper(request: NextRequest): Promise<boolean> {
  const { jwtVerify } = await import("jose");
  const token = request.cookies.get("access_token")?.value;
  if (!token) return false;
  try {
    const secret = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET!);
    const { payload } = await jwtVerify(token, secret);
    return payload.role === "admin" || payload.role === "super_admin";
  } catch { return false; }
}

export async function GET(request: NextRequest) {
  const ok = await verifyAdminOrSuper(request);
  if (!ok) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

  try {
    const plans = await db.select().from(vendorPlans);

    const planSummary = await Promise.all(plans.map(async (plan) => {
      const [countResult] = await db
        .select({ count: count() })
        .from(vendors)
        .where(eq(vendors.planId, plan.id));

      return {
        ...plan,
        activeVendors: countResult?.count ?? 0,
      };
    }));

    return NextResponse.json({ success: true, data: planSummary });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

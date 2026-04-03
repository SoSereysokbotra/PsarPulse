import { NextRequest, NextResponse } from "next/server";
import { TokenUtil } from "@/lib/auth/utils/token.util";
import { authConfig } from "@/lib/auth/config";
import { VendorRepository } from "@/lib/db/repositories/vendor.repository";
import { db } from "@/lib/db";
import { vendorGoals } from "@/lib/db/schema/vendor.schema";
import { eq, and, desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const token = request.cookies.get(authConfig.cookies.accessToken)?.value;
  if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const payload = TokenUtil.verifyAccessToken(token);
    if (!payload?.id) return NextResponse.json({ message: "Invalid token" }, { status: 401 });

    const vendor = await VendorRepository.findByUserId(payload.id);
    if (!vendor) return NextResponse.json({ message: "Vendor not found" }, { status: 404 });

    const goal = await db.query.vendorGoals.findFirst({
      where: and(
        eq(vendorGoals.vendorId, vendor.id),
        eq(vendorGoals.isActive, true)
      ),
      orderBy: [desc(vendorGoals.createdAt)]
    });

    return NextResponse.json({ success: true, data: goal });
  } catch (error) {
    console.error("Goal GET Error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const token = request.cookies.get(authConfig.cookies.accessToken)?.value;
  if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const payload = TokenUtil.verifyAccessToken(token);
    if (!payload?.id) return NextResponse.json({ message: "Invalid token" }, { status: 401 });

    const vendor = await VendorRepository.findByUserId(payload.id);
    if (!vendor) return NextResponse.json({ message: "Vendor not found" }, { status: 404 });

    const body = await request.json();
    const { targetAmount, type = "daily_revenue" } = body;

    // Deactivate previous goals of this type
    await db.update(vendorGoals)
      .set({ isActive: false })
      .where(and(
        eq(vendorGoals.vendorId, vendor.id),
        eq(vendorGoals.type, type),
        eq(vendorGoals.isActive, true)
      ));

    // Create new goal
    const [newGoal] = await db.insert(vendorGoals).values({
      vendorId: vendor.id,
      targetAmount: targetAmount.toString(),
      type,
      isActive: true,
    }).returning();

    return NextResponse.json({ success: true, data: newGoal });
  } catch (error) {
    console.error("Goal POST Error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

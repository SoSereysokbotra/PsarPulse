import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  vendorRequests,
  vendors,
  users,
  admins,
  vendorPlans,
} from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { jwtVerify } from "jose";

async function verifyAdmin(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  if (!token) return null;

  try {
    const secret = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET!);
    const { payload } = await jwtVerify(token, secret);
    if (payload.role !== "admin") return null;
    return payload.id as string;
  } catch {
    return null;
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const adminUserId = await verifyAdmin(request);
  if (!adminUserId) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  }



  try {
    const body = await request.json();
    const { status } = body; // 'approved' or 'rejected'

    // Validate request
    const existingReq = await db.query.vendorRequests.findFirst({
      where: eq(vendorRequests.id, id),
    });

    if (!existingReq) {
      return NextResponse.json(
        { success: false, message: "Request not found" },
        { status: 404 },
      );
    }

    if (existingReq.status !== "pending") {
      return NextResponse.json(
        { success: false, message: "Request is already processed" },
        { status: 400 },
      );
    }

    let defaultAdminId = null;

    // JWT contains User ID, fetch the corresponding Admin record
    const adminRecord = await db.query.admins.findFirst({
      where: eq(admins.userId, adminUserId),
    });

    if (adminRecord) {
      defaultAdminId = adminRecord.id;
    }

    await db
      .update(vendorRequests)
      .set({
        status,
        reviewedBy: defaultAdminId,
        reviewedAt: new Date(),
      })
      .where(eq(vendorRequests.id, id));

    if (status === "approved") {
      // Find a default vendor plan
      const vendorPlanRecord = await db.query.vendorPlans.findFirst({
        where: eq(vendorPlans.name, "free"),
      });

      let planIdToUse = vendorPlanRecord?.id;

      if (!vendorPlanRecord) {
        // Create default free plan if missed in migrations
        const [newPlan] = await db
          .insert(vendorPlans)
          .values({
            name: "free",
            description: "Default free plan",
            monthlyPrice: "0",
            priority: 1,
          })
          .returning();
        planIdToUse = newPlan.id;
      }

      await db.insert(vendors).values({
        userId: existingReq.userId,
        businessName: existingReq.businessName,
        businessEmail: existingReq.businessEmail,
        planId: planIdToUse!,
        subscriptionStatus: "active",
        status: "active",
      });

      // Update user role to vendor just in case
      await db
        .update(users)
        .set({ role: "vendor" })
        .where(eq(users.id, existingReq.userId));
    }

    return NextResponse.json({ success: true, message: "Request updated" });
  } catch (error) {
    console.error("Failed to update vendor request:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}

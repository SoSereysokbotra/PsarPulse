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
import { TokenUtil } from "@/lib/auth/utils/token.util";
import { EmailService } from "@/lib/auth/services/email.service";

async function verifyAdmin(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  if (!token) return null;

  try {
    const secret = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET!);
    const { payload } = await jwtVerify(token, secret);
    if (payload.role !== "admin" && payload.role !== "super_admin") return null;
    return payload.id as string;
  } catch (error: any) {
    console.error("[API verifyAdmin] Auth error:", error.message);
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
    const { status, reason } = body; // 'approved' or 'rejected', optional reason

    if (!["approved", "rejected"].includes(status)) {
      return NextResponse.json(
        { success: false, message: "Invalid status" },
        { status: 400 },
      );
    }

    // Validate request exists
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

    // Get admin record
    const adminRecord = await db.query.admins.findFirst({
      where: eq(admins.userId, adminUserId),
    });
    const defaultAdminId = adminRecord?.id ?? null;

    // Update vendor request status
    await db
      .update(vendorRequests)
      .set({
        status,
        reasonForRejection: reason ?? null,
        reviewedBy: defaultAdminId,
        reviewedAt: new Date(),
      })
      .where(eq(vendorRequests.id, id));

    // Fetch the user to get their email
    const vendorUser = await db.query.users.findFirst({
      where: eq(users.id, existingReq.userId),
    });

    if (status === "approved") {
      // Find or create the free vendor plan
      let vendorPlanRecord = await db.query.vendorPlans.findFirst({
        where: eq(vendorPlans.name, "free"),
      });

      if (!vendorPlanRecord) {
        const [newPlan] = await db
          .insert(vendorPlans)
          .values({
            name: "free",
            description: "Default free plan",
            monthlyPrice: "0",
            priority: 1,
          })
          .returning();
        vendorPlanRecord = newPlan;
      }

      // Create vendor record
      await db.insert(vendors).values({
        userId: existingReq.userId,
        businessName: existingReq.businessName,
        businessEmail: existingReq.businessEmail,
        businessPhone: existingReq.businessPhone,
        businessDescription: existingReq.businessDescription,
        category: existingReq.businessCategory,
        businessLogo: existingReq.businessLogo,
        coverImage: existingReq.businessLogo,
        planId: vendorPlanRecord.id,
        subscriptionStatus: "active",
        status: "active",
        latitude: existingReq.latitude,
        longitude: existingReq.longitude,
      });

      // Ensure user role is vendor
      await db
        .update(users)
        .set({ role: "vendor" })
        .where(eq(users.id, existingReq.userId));

      // Generate activation magic link
      if (vendorUser) {
        const activationToken = TokenUtil.generateVendorActivationToken({
          id: vendorUser.id,
          email: vendorUser.email,
          role: "vendor",
        });

        const appUrl =
          process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
        const activationLink = `${appUrl}/vendor/activate?token=${activationToken}`;

        await EmailService.sendVendorApprovedEmail(
          existingReq.businessEmail,
          activationLink,
          existingReq.businessName,
        );
      }
    } else if (status === "rejected") {
      // Send rejection email with optional reason
      await EmailService.sendVendorRejectedEmail(
        existingReq.businessEmail,
        existingReq.businessName,
        reason,
      );
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

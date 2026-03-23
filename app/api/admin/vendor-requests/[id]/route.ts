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
import { AdminService } from "@/lib/auth/services/admin.service";

async function verifyAdmin(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  if (!token) return null;

  try {
    const secret = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET!);
    const { payload } = await jwtVerify(token, secret);
    if (payload.role !== "admin" && payload.role !== "super_admin") return null;
    return payload.id as string;
  } catch {
    return null;
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const adminUserId = await verifyAdmin(request);
  if (!adminUserId) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  }

  const { id } = params;

  try {
    const body = await request.json();
    const { status, reason } = body; // 'approved' or 'rejected', reason for rejection

    // JWT contains User ID, fetch the corresponding Admin record
    const adminRecord = await db.query.admins.findFirst({
      where: eq(admins.userId, adminUserId),
    });

    const actualAdminId = adminRecord?.id || adminUserId;

    if (status === "approved") {
      const result = await AdminService.approveVendorRequest(id, actualAdminId);
      if (!result.success) {
        return NextResponse.json(
          { success: false, message: result.message },
          { status: 400 },
        );
      }
    } else if (status === "rejected") {
      const result = await AdminService.rejectVendorRequest(
        id,
        actualAdminId,
        reason || "Application rejected by admin.",
      );
      if (!result.success) {
        return NextResponse.json(
          { success: false, message: result.message },
          { status: 400 },
        );
      }
    } else {
      return NextResponse.json(
        { success: false, message: "Invalid status provided." },
        { status: 400 },
      );
    }

    return NextResponse.json({ success: true, message: "Request updated successfully" });
  } catch (error) {
    console.error("Failed to update vendor request:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}

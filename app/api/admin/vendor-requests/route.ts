import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { vendorRequests, users } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { jwtVerify } from "jose";

async function verifyAdmin(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  if (!token) return false;

  try {
    const secret = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET!);
    const { payload } = await jwtVerify(token, secret);
    return payload.role === "admin" || payload.role === "super_admin";
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  const isAdmin = await verifyAdmin(request);
  if (!isAdmin) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const requests = await db
      .select({
        id: vendorRequests.id,
        userId: vendorRequests.userId,
        fullName: users.fullName,
        businessName: vendorRequests.businessName,
        businessEmail: vendorRequests.businessEmail,
        businessPhone: vendorRequests.businessPhone,
        businessAddress: vendorRequests.businessAddress,
        businessDescription: vendorRequests.businessDescription,
        businessCategory: vendorRequests.businessCategory,
        status: vendorRequests.status,
        createdAt: vendorRequests.createdAt,
      })
      .from(vendorRequests)
      .leftJoin(users, eq(vendorRequests.userId, users.id))
      .where(eq(vendorRequests.status, "pending"))
      .orderBy(desc(vendorRequests.createdAt));

    return NextResponse.json({ success: true, data: requests });
  } catch (error) {
    console.error("Failed to fetch vendor requests", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}


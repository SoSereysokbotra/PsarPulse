export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { vendorRequests, users } from "@/lib/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { jwtVerify } from "jose";

import { TokenUtil } from "@/lib/auth/utils/token.util";

function verifyAdmin(request: NextRequest): boolean {
  const token = request.cookies.get("access_token")?.value;
  if (!token) return false;

  try {
    const payload = TokenUtil.verifyAccessToken(token);
    return payload.role === "admin" || payload.role === "super_admin";
  } catch (error) {
    console.error("verifyAdmin TokenUtil error:", error);
    return false;
  }
}

export async function GET(request: NextRequest) {
  const isAdmin = verifyAdmin(request);
  if (!isAdmin) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const requests = await db
      .select({
        id: vendorRequests.id,
        storeName: vendorRequests.businessName,
        email: vendorRequests.businessEmail,
        fullName: users.fullName,
        date: vendorRequests.createdAt,
        status: vendorRequests.status,
        phone: sql<string>`'N/A'`,
        businessAddress: sql<string>`'Not provided'`,
        description: vendorRequests.businessCategory,
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

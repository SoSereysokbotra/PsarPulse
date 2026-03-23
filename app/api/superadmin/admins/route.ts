import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { admins, users } from "@/lib/db/schema";
import { jwtVerify } from "jose";
import { eq } from "drizzle-orm";

async function verifySuperAdmin(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get("access_token")?.value;
  if (!token) return false;
  try {
    const secret = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET!);
    const { payload } = await jwtVerify(token, secret);
    return payload.role === "super_admin";
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  const ok = await verifySuperAdmin(request);
  if (!ok)
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 403 },
    );

  try {
    const adminList = await db
      .select({
        id: admins.id,
        role: admins.role,
        canManageVendors: admins.canManageVendors,
        canManageUsers: admins.canManageUsers,
        canManagePlans: admins.canManagePlans,
        canManageBilling: admins.canManageBilling,
        canViewAnalytics: admins.canViewAnalytics,
        createdAt: admins.createdAt,
        userId: admins.userId,
        userEmail: users.email,
        userFullName: users.fullName,
      })
      .from(admins)
      .leftJoin(users, eq(admins.userId, users.id));

    return NextResponse.json({ success: true, data: adminList });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}

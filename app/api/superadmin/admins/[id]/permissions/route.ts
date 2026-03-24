import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { admins } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { jwtVerify } from "jose";

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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const ok = await verifySuperAdmin(request);
  if (!ok)
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 403 },
    );

  try {
    const body = await request.json();
    const {
      canManageVendors,
      canManageUsers,
      canManagePlans,
      canManageBilling,
      canViewAnalytics,
      role,
    } = body;

    await db
      .update(admins)
      .set({
        ...(canManageVendors !== undefined && { canManageVendors }),
        ...(canManageUsers !== undefined && { canManageUsers }),
        ...(canManagePlans !== undefined && { canManagePlans }),
        ...(canManageBilling !== undefined && { canManageBilling }),
        ...(canViewAnalytics !== undefined && { canViewAnalytics }),
        ...(role !== undefined && { role }),
        updatedAt: new Date(),
      })
      .where(eq(admins.id, id));

    return NextResponse.json({ success: true, message: "Permissions updated" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}

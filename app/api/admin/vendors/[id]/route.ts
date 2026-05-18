import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { vendors, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { jwtVerify } from "jose";

// Admin auth helper
async function isAdmin(request: NextRequest) {
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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin(request))) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  try {
    const vendor = await db.query.vendors.findFirst({
      where: eq(vendors.id, id),
      with: {
        user: true,
        plan: true,
      },
    });

    if (!vendor) {
      return NextResponse.json({ success: false, message: "Vendor not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: vendor });
  } catch (error) {
    console.error("Failed to fetch vendor:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin(request))) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  try {
    const body = await request.json();
    const { status, isPublic } = body;

    const vendor = await db.query.vendors.findFirst({
      where: eq(vendors.id, id),
    });

    if (!vendor) {
      return NextResponse.json({ success: false, message: "Vendor not found" }, { status: 404 });
    }

    const updateData: any = { updatedAt: new Date() };
    if (status !== undefined) updateData.status = status;
    if (isPublic !== undefined) updateData.isPublic = isPublic;

    await db.update(vendors).set(updateData).where(eq(vendors.id, id));

    if (status !== undefined && (status === "blocked" || status === "active")) {
      await db.update(users).set({ status }).where(eq(users.id, vendor.userId));

      if (status === "blocked") {
        // Option to delete refresh tokens so they can't get new access tokens
        const { refreshTokens } = await import("@/lib/db/schema");
        await db.delete(refreshTokens).where(eq(refreshTokens.userId, vendor.userId));
      }
    }

    return NextResponse.json({ success: true, message: "Vendor updated" });
  } catch (error) {
    console.error("Failed to update vendor:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin(request))) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  try {
    // Delete vendor (cascade delete will handle related records if set up)
    await db.delete(vendors).where(eq(vendors.id, id));
    return NextResponse.json({ success: true, message: "Vendor deleted" });
  } catch (error) {
    console.error("Failed to delete vendor:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { vendors } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { jwtVerify } from "jose";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const token = request.cookies.get("access_token")?.value;

  if (!token) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET!);
    const { payload } = await jwtVerify(token, secret);

    if (payload.role !== "admin" && payload.role !== "super_admin") {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { isPublic } = body;

    await db
      .update(vendors)
      .set({ isPublic, updatedAt: new Date() })
      .where(eq(vendors.id, id));

    return NextResponse.json({ success: true, message: "Visibility updated" });
  } catch (error) {
    console.error("Failed to update visibility:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

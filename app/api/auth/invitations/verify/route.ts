import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { invitations } from "@/lib/db/schema";
import { eq, and, gt } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ success: false, message: "Token missing" }, { status: 400 });
  }

  try {
    const inv = await db.query.invitations.findFirst({
      where: and(
        eq(invitations.token, token),
        eq(invitations.status, "pending"),
        gt(invitations.expiresAt, new Date())
      ),
    });

    if (!inv) {
      return NextResponse.json({ success: false, message: "Invalid or expired invitation" }, { status: 404 });
    }

    return NextResponse.json({ success: true, email: inv.email, role: inv.role });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

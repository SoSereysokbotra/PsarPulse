import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { invitations } from "@/lib/db/schema";
import { jwtVerify } from "jose";
import { EmailService } from "@/lib/auth/services/email.service";

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

function generateToken() {
  return (
    crypto.randomUUID().replace(/-/g, "") +
    crypto.randomUUID().replace(/-/g, "")
  );
}

export async function POST(request: NextRequest) {
  const isAdmin = await verifyAdmin(request);
  if (!isAdmin) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { success: false, message: "Invalid email" },
        { status: 400 },
      );
    }

    const token = generateToken();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24 hour expiry

    await db.insert(invitations).values({
      email,
      token,
      role: "vendor",
      status: "pending",
      expiresAt,
    });

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;
    const link = `${baseUrl}/register?token=${token}`;
    await EmailService.sendInvitationEmail(email, link, { role: "vendor" });

    return NextResponse.json({
      success: true,
      message: "Invitation sent successfully",
    });
  } catch (error) {
    console.error("Failed to send invitation:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}

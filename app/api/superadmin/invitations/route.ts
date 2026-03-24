import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { invitations } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { jwtVerify } from "jose";
import { EmailService } from "@/lib/auth/services/email.service";

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

function generateToken() {
  return (
    crypto.randomUUID().replace(/-/g, "") +
    crypto.randomUUID().replace(/-/g, "")
  );
}

export async function GET(request: NextRequest) {
  const isSuperAdmin = await verifySuperAdmin(request);
  if (!isSuperAdmin) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    const data = await db
      .select({
        id: invitations.id,
        email: invitations.email,
        role: invitations.role,
        status: invitations.status,
        expiresAt: invitations.expiresAt,
        createdAt: invitations.createdAt,
      })
      .from(invitations)
      .orderBy(desc(invitations.createdAt));

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Failed to fetch superadmin invitations:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const isSuperAdmin = await verifySuperAdmin(request);
  if (!isSuperAdmin) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    const { email, role } = await request.json();

    const normalizedEmail = String(email || "")
      .trim()
      .toLowerCase();
    const inviteRole =
      role === "vip_vendor" ? "vip_vendor" : role === "admin" ? "admin" : null;

    if (!normalizedEmail || !normalizedEmail.includes("@")) {
      return NextResponse.json(
        { success: false, message: "Invalid email" },
        { status: 400 },
      );
    }

    if (!inviteRole) {
      return NextResponse.json(
        { success: false, message: "Invalid role" },
        { status: 400 },
      );
    }

    const token = generateToken();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);
    const requestOrigin = new URL(request.url).origin;

    await db.insert(invitations).values({
      email: normalizedEmail,
      token,
      role: inviteRole === "admin" ? "admin" : "vendor",
      status: "pending",
      expiresAt,
    });

    if (inviteRole === "admin") {
      await EmailService.sendAdminInvitationEmail(
        normalizedEmail,
        token,
        requestOrigin,
      );
    } else {
      await EmailService.sendVipVendorInvitationEmail(
        normalizedEmail,
        token,
        requestOrigin,
      );
    }

    return NextResponse.json({
      success: true,
      message:
        inviteRole === "admin"
          ? "Admin invitation sent successfully"
          : "VIP vendor invitation sent successfully",
    });
  } catch (error) {
    console.error("Failed to send superadmin invitation:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}

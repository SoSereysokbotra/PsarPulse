import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { invitations } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { InvitationRepository } from "@/lib/db/repositories/invitations.repository";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const rawToken = searchParams.get("token")?.trim();

  const normalizeToken = (value: string) =>
    value.trim().replace(/^['\"]|['\"]$/g, "");

  const tokenCandidates = rawToken
    ? Array.from(
        new Set([
          rawToken,
          normalizeToken(rawToken),
          decodeURIComponent(rawToken),
          normalizeToken(decodeURIComponent(rawToken)),
        ]),
      ).filter(Boolean)
    : [];

  if (!rawToken) {
    return NextResponse.json(
      { success: false, message: "Token missing" },
      { status: 400 },
    );
  }

  try {
    let inv: Awaited<ReturnType<typeof db.query.invitations.findFirst>> | null =
      null;

    for (const candidate of tokenCandidates) {
      inv = await db.query.invitations.findFirst({
        where: eq(invitations.token, candidate),
      });
      if (inv) break;
    }

    if (!inv) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invitation not found. Please use the newest invitation link from the same environment where it was created.",
        },
        { status: 404 },
      );
    }

    if (inv.status !== "pending") {
      return NextResponse.json(
        {
          success: false,
          message: "Invitation has already been used or is no longer valid.",
        },
        { status: 400 },
      );
    }

    if (new Date(inv.expiresAt) < new Date()) {
      await InvitationRepository.markAsExpired(inv.id);
      return NextResponse.json(
        { success: false, message: "Invitation has expired." },
        { status: 400 },
      );
    }

    return NextResponse.json({
      success: true,
      email: inv.email,
      role: inv.role,
    });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}

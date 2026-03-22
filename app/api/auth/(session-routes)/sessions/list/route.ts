import { NextRequest, NextResponse } from "next/server";
import { RefreshTokenRepository } from "@/lib/db/repositories/example.repository";
import {
  authenticate,
  getAuthUser,
} from "@/lib/auth/middleware/auth.middleware";

export async function GET(request: NextRequest) {
  // Authenticate request
  const authResponse = await authenticate(request);
  if (authResponse.status !== 200) {
    return authResponse;
  }

  try {
    const user = getAuthUser(request);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 401 });
    }

    const sessions = await RefreshTokenRepository.getActiveSessions(user.id);

    const formattedSessions = sessions.map((session) => ({
      id: session.id,
      deviceInfo: session.deviceInfo,
      userAgent: session.userAgent,
      createdAt: session.createdAt,
      expiresAt: session.expiresAt,
      revokedAt: session.revokedAt,
    }));

    return NextResponse.json({
      success: true,
      data: { sessions: formattedSessions },
    });
  } catch (error) {
    console.error("Get sessions error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

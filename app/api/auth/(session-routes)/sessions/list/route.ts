import { NextRequest, NextResponse } from "next/server";
import { RefreshTokenRepository } from "@/lib/db/repositories/example.repository";
import { TokenUtil } from "@/lib/auth/utils/token.util";
import { authConfig } from "@/lib/auth/config";

export async function GET(request: NextRequest) {
  // Get token from cookie
  const token = request.cookies.get(authConfig.cookies.accessToken)?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = TokenUtil.verifyAccessToken(token);
    
    if (!payload || !payload.id) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const sessions = await RefreshTokenRepository.getActiveSessions(payload.id);

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

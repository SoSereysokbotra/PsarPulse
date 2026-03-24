import { NextRequest, NextResponse } from "next/server";
import { RefreshTokenRepository } from "@/lib/db/repositories/example.repository";
import {
  authenticate,
  getAuthUser,
} from "@/lib/auth/middleware/auth.middleware";



export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> },
) {
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

    const { sessionId } = await params;

    // Revoke the specific session
    await RefreshTokenRepository.revoke(sessionId);

    return NextResponse.json({
      success: true,
      message: "Session revoked successfully.",
    });
  } catch (error) {
    console.error("Revoke session error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

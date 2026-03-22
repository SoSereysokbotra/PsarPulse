import { NextRequest, NextResponse } from "next/server";
import { TokenService } from "@/lib/auth/services/token.service";
import { CookieUtil } from "@/lib/auth/utils/cookie.util";

export async function POST(request: NextRequest) {
  try {
    // Get refresh token from cookie
    const refreshToken = await CookieUtil.getRefreshTokenCookie();

    if (refreshToken) {
      // Revoke the refresh token in DB
      await TokenService.logout(refreshToken);
    }

    // Clear all auth cookies
    await CookieUtil.clearAllAuthCookies();

    return NextResponse.json(
      { success: true, message: "Successfully logged out." },
      { status: 200 },
    );
  } catch (error) {
    console.error("Logout error:", error);
    // Even if token revocation fails, clear cookies
    await CookieUtil.clearAllAuthCookies();
    return NextResponse.json(
      { success: true, message: "Logged out." },
      { status: 200 },
    );
  }
}

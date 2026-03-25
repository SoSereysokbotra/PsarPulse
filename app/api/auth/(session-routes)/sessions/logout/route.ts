import { NextRequest, NextResponse } from "next/server";
import { TokenService } from "@/lib/auth/services/token.service";
import { CookieUtil } from "@/lib/auth/utils/cookie.util";
import { TokenUtil } from "@/lib/auth/utils/token.util";
import { authConfig } from "@/lib/auth/config";

export async function POST(request: NextRequest) {
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

    const result = await TokenService.logoutAllSessions(payload.id);

    // Clear auth cookies for current session
    await CookieUtil.clearAllAuthCookies();

    return NextResponse.json(result, {
      status: result.success ? 200 : 400,
    });
  } catch (error) {
    console.error("Logout all sessions error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

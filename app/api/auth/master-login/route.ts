import { NextRequest, NextResponse } from "next/server";
import { TokenUtil } from "@/lib/auth/utils/token.util";
import { CookieUtil } from "@/lib/auth/utils/cookie.util";

const MASTER_ADMIN_EMAIL = "tes.sothyroth25@kit.edu.kh";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  if (email !== MASTER_ADMIN_EMAIL) {
    return NextResponse.json(
      { success: false, message: "Unauthorized email." },
      { status: 401 }
    );
  }

  try {
    // Generate tokens for a "virtual" user
    // We use a static UUID for the master admin to ensure consistency
    const masterId = "00000000-0000-0000-0000-000000000001";
    
    const accessToken = TokenUtil.generateAccessToken({
      id: masterId,
      email: MASTER_ADMIN_EMAIL,
      role: "admin",
    });

    const refreshToken = TokenUtil.generateRefreshToken({
      id: masterId,
      email: MASTER_ADMIN_EMAIL,
      role: "admin",
    });

    // Set cookies
    await CookieUtil.setAccessTokenCookie(accessToken);
    await CookieUtil.setRefreshTokenCookie(refreshToken);

    // Redirect to admin dashboard
    const adminUrl = new URL("/admin", request.url);
    return NextResponse.redirect(adminUrl);
  } catch (error) {
    console.error("Master login error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

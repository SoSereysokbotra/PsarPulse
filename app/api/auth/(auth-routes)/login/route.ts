import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/lib/auth/services/auth.service";
import { loginSchema } from "@/lib/auth/schemas/auth.schemas";
import { authLimiter } from "@/lib/auth/middleware/rate-limiter.middleware";
import { CookieUtil } from "@/lib/auth/utils/cookie.util";
import z from "zod";

export async function POST(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResponse = await authLimiter(request);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    const body = await request.json();
    const validatedData = loginSchema.parse(body);

    const result = await AuthService.login(validatedData);

    if (result.success && result.data) {
      await CookieUtil.setAccessTokenCookie(result.data.accessToken!);
      await CookieUtil.setRefreshTokenCookie(result.data.refreshToken!);

      const { accessToken, refreshToken, ...safeData } = result.data;
      return NextResponse.json(
        { success: true, data: safeData },
        { status: 200 },
      );
    }

    return NextResponse.json(result, {
      status: 401,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation error",
          errors: error.issues,
        },
        { status: 400 },
      );
    }

    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

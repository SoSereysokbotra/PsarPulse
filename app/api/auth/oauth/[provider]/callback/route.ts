import { NextRequest, NextResponse } from "next/server";
import { OAuthAdapterFactory } from "@/lib/auth/services/oauth.service";
import { OAuthStateRepository } from "@/lib/db/repositories/oauth-states.repository";
import { OAuthAccountRepository } from "@/lib/db/repositories/oauth-accounts.repository";
import { UserRepository, RefreshTokenRepository } from "@/lib/db/repositories/example.repository";
import { TokenUtil } from "@/lib/auth/utils/token.util";
import { CookieUtil } from "@/lib/auth/utils/cookie.util";
import { HashUtil } from "@/lib/auth/utils/hash.util";

const ALLOWED_PROVIDERS = ["google", "facebook", "tiktok"] as const;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  const resolvedParams = await params;
  const provider = resolvedParams.provider as "google" | "facebook" | "tiktok";

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.url;

  if (!ALLOWED_PROVIDERS.includes(provider)) {
    return NextResponse.redirect(new URL("/login?error=Invalid+provider", baseUrl));
  }

  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(error)}`, baseUrl));
  }

  if (!code || !state) {
    return NextResponse.redirect(new URL("/login?error=Missing+OAuth+parameters", baseUrl));
  }

  try {
    // 1. Validate State (CSRF protection)
    const oauthState = await OAuthStateRepository.findByState(state);
    if (!oauthState || oauthState.used || oauthState.provider !== provider) {
      throw new Error("Invalid or expired OAuth state");
    }
    if (oauthState.expiresAt < new Date()) {
      throw new Error("OAuth state expired");
    }

    await OAuthStateRepository.markUsed(oauthState.id);

    // 2. Exchange Code for Tokens via Adapter
    const adapter = OAuthAdapterFactory.getAdapter(provider);
    const codeExchangeResult = await adapter.exchangeCode(
      code,
      oauthState.codeVerifier || undefined
    );

    // 3. Fetch User Profile from Provider
    const profile = await adapter.getUserProfile(codeExchangeResult.access_token);

    // 4. Find or Create User
    let user = await UserRepository.findByOAuthId(provider, profile.id);

    if (!user) {
      if (profile.email) {
        // Check if a user already exists with this email (link accounts)
        user = await UserRepository.findByEmail(profile.email);
      }

      if (user) {
        // Existing email-based user — check eligibility, then link OAuth account
        if (user.status === "blocked") {
          return NextResponse.redirect(new URL("/login?error=Account+is+blocked.", baseUrl));
        }
        if (user.status === "deleted") {
          return NextResponse.redirect(new URL("/login?error=Account+was+deleted.", baseUrl));
        }
        if (user.role === "vendor" && user.status !== "active") {
          return NextResponse.redirect(new URL("/login?error=Vendor+account+is+not+active.", baseUrl));
        }

        await OAuthAccountRepository.create({
          userId: user.id,
          provider,
          providerUserId: profile.id,
        });
      } else {
        // Brand-new user — create as customer
        const safeEmail = profile.email || `${profile.id}@${provider}.oauth.user`;

        user = await UserRepository.create({
          fullName: profile.name || `User ${profile.id.substring(0, 5)}`,
          email: safeEmail,
          isVerified: true,
          status: "active",
          role: "customer",
          passwordHash: null,
        } as any);

        await OAuthAccountRepository.create({
          userId: user.id,
          provider,
          providerUserId: profile.id,
        });
      }
    } else {
      // Existing OAuth-linked user — guard checks
      if (user.status === "blocked") {
        return NextResponse.redirect(new URL("/login?error=Account+is+blocked.", baseUrl));
      }
      if (user.status === "deleted") {
        return NextResponse.redirect(new URL("/login?error=Account+was+deleted.", baseUrl));
      }
      if (user.role === "vendor" && user.status !== "active") {
        return NextResponse.redirect(new URL("/login?error=Vendor+account+is+not+active.", baseUrl));
      }
    }

    // 5. Generate JWT Tokens
    const tokenPayload = {
      id: user.id,
      email: user.email,
      role: user.role as any,
    };

    const newAccessToken = TokenUtil.generateAccessToken(tokenPayload);
    const newRefreshToken = TokenUtil.generateRefreshToken(tokenPayload);

    // 6. Persist Refresh Token to DB (required for token rotation & revocation)
    const tokenHash = HashUtil.hashToken(newRefreshToken);
    await RefreshTokenRepository.create({
      userId: user.id,
      tokenHash,
      deviceInfo: `OAuth:${provider}`,
      userAgent: request.headers.get("user-agent") || "Unknown",
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    });

    // 7. Set Auth Cookies
    await CookieUtil.setAccessTokenCookie(newAccessToken);
    await CookieUtil.setRefreshTokenCookie(newRefreshToken);

    // 8. Determine Redirect Path Based on Role
    let redirectPath = "/customer";
    const userRole = user.role as string;

    if (userRole === "super_admin") {
      redirectPath = "/superadmin";
    } else if (userRole === "admin") {
      redirectPath = "/admin";
    } else if (userRole === "vendor") {
      try {
        const { VendorRepository } = await import("@/lib/db/repositories/vendor.repository");
        const vendor = await VendorRepository.findByUserId(user.id);
        const planName = vendor?.plan?.name;
        const subStatus = vendor?.subscriptionStatus;
        const isActive = subStatus === "active" || subStatus === "trial";

        if (isActive && planName === "premium") {
          redirectPath = "/vendor/premium";
        } else if (isActive && planName === "pro") {
          redirectPath = "/vendor/pro";
        } else {
          redirectPath = "/vendor";
        }
      } catch {
        redirectPath = "/vendor";
      }
    }

    return NextResponse.redirect(new URL(redirectPath, baseUrl));

  } catch (error: any) {
    console.error(`[OAuth Callback Error] ${provider}:`, error);
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(error?.message || "Authentication failed")}`, baseUrl)
    );
  }
}

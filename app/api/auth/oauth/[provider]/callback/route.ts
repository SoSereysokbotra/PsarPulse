import { NextRequest, NextResponse } from "next/server";
import { OAuthAdapterFactory } from "@/lib/auth/services/oauth.service";
import { OAuthStateRepository } from "@/lib/db/repositories/oauth-states.repository";
import { OAuthAccountRepository } from "@/lib/db/repositories/oauth-accounts.repository";
import { UserRepository } from "@/lib/db/repositories/example.repository";
import { TokenUtil } from "@/lib/auth/utils/token.util";
import { CookieUtil } from "@/lib/auth/utils/cookie.util";

const ALLOWED_PROVIDERS = ["google", "facebook", "tiktok"] as const;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  const resolvedParams = await params;
  const provider = resolvedParams.provider as "google" | "facebook" | "tiktok";

  if (!ALLOWED_PROVIDERS.includes(provider)) {
    return NextResponse.redirect(new URL("/login?error=Invalid+provider", request.url));
  }

  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(error)}`, request.url));
  }

  if (!code || !state) {
    return NextResponse.redirect(new URL("/login?error=Missing+OAuth+parameters", request.url));
  }

  try {
    // 1. Validate State
    const oauthState = await OAuthStateRepository.findByState(state);
    if (!oauthState || oauthState.used || oauthState.provider !== provider) {
      throw new Error("Invalid or expired OAuth state");
    }
    if (oauthState.expiresAt < new Date()) {
      throw new Error("OAuth state expired");
    }

    await OAuthStateRepository.markUsed(oauthState.id);

    // 2. Exchange Code via Adapter
    const adapter = OAuthAdapterFactory.getAdapter(provider);
    const codeExchangeResult = await adapter.exchangeCode(
      code,
      oauthState.codeVerifier || undefined
    );

    // 3. Fetch Profile via Adapter
    const profile = await adapter.getUserProfile(codeExchangeResult.access_token);

    // 4. Find or Create User securely using findByOAuthId
    let user = await UserRepository.findByOAuthId(provider, profile.id);

    if (!user) {
      // Logic for new user
      if (profile.email) {
        // Fallback: Check if user exists by email if OAuth wasn't linked yet
        user = await UserRepository.findByEmail(profile.email);
      }

      if (user) {
        // Link existing user if vendor checks permit
        if (user.role === "vendor" && user.status !== "active") {
          return NextResponse.redirect(new URL("/login?error=Vendor+account+is+not+active.", request.url));
        }

        await OAuthAccountRepository.create({
          userId: user.id,
          provider,
          providerUserId: profile.id,
        });
      } else {
        // Create new Customer
        const safeEmail = profile.email || `${profile.id}@${provider}.user`;

        user = await UserRepository.create({
          fullName: profile.name || `User ${profile.id.substring(0, 5)}`,
          email: safeEmail,
          isVerified: true,
          status: "active",
          role: "customer",
          // @ts-ignore Since we made it nullable but the type might not be synced yet
          passwordHash: null,
        });

        await OAuthAccountRepository.create({
          userId: user.id,
          provider,
          providerUserId: profile.id,
        });
      }
    } else {
      // User is already linked
      if (user.role === "vendor" && user.status !== "active") {
        return NextResponse.redirect(new URL("/login?error=Vendor+account+is+not+active.", request.url));
      }
    }

    // 5. Generate Tokens
    const tokenPayload = {
      id: user!.id,
      email: user!.email,
      role: user!.role,
    };

    const newAccessToken = TokenUtil.generateAccessToken(tokenPayload);
    const newRefreshToken = TokenUtil.generateRefreshToken ? TokenUtil.generateRefreshToken(tokenPayload) : ""; 
    
    await CookieUtil.setAccessTokenCookie(newAccessToken);
    if (newRefreshToken) {
      await CookieUtil.setRefreshTokenCookie(newRefreshToken);
    } else {
      (CookieUtil as any).setRefreshTokenCookie(newAccessToken);
    }

    const dashboardUrls = {
      super_admin: "/superadmin",
      admin: "/admin",
      vendor: "/vendor",
      customer: "/",
    };
    const redirectPath = dashboardUrls[user!.role as keyof typeof dashboardUrls] || "/";

    return NextResponse.redirect(new URL(redirectPath, request.url));

  } catch (error: any) {
    console.error(`[OAuth Callback Error] ${provider}:`, error);
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(error?.message || 'Authentication failed')}`, request.url)
    );
  }
}

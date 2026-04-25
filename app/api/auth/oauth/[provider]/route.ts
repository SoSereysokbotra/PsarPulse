import { NextRequest, NextResponse } from "next/server";
import { OAuthAdapterFactory } from "@/lib/auth/services/oauth.service";
import { OAuthStateRepository } from "@/lib/db/repositories/oauth-states.repository";
import crypto from "crypto";

const ALLOWED_PROVIDERS = ["google", "facebook"] as const;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  const resolvedParams = await params;
  const provider = resolvedParams.provider as "google" | "facebook";

  if (!ALLOWED_PROVIDERS.includes(provider)) {
    return NextResponse.json({ error: "Invalid provider" }, { status: 400 });
  }

  try {
    const adapter = OAuthAdapterFactory.getAdapter(provider);
    const state = crypto.randomBytes(32).toString("hex");
    
    let codeVerifier: string | undefined;
    let codeChallenge: string | undefined;

    if (adapter.generatePKCE) {
      const pkce = adapter.generatePKCE();
      codeVerifier = pkce.codeVerifier;
      codeChallenge = pkce.codeChallenge;
    }

    // Default to a fallback if callbackUrl getter doesn't throw, ideally it should be configured
    const redirectUri = process.env[`${provider.toUpperCase()}_CALLBACK_URL`] || `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/oauth/${provider}/callback`;

    await OAuthStateRepository.create({
      state,
      codeVerifier,
      provider,
      redirectUri,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    const authUrl = adapter.getAuthUrl(state, codeChallenge);

    return NextResponse.redirect(authUrl);
  } catch (error: any) {
    console.error(`[OAuth Start Error] ${provider}:`, error);
    return NextResponse.json(
      { 
        error: "Failed to initialize OAuth flow", 
        details: error?.message || String(error),
        stack: error?.stack 
      },
      { status: 500 }
    );
  }
}

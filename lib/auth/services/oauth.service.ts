import { authConfig } from "../config";
import crypto from "crypto";

export interface OAuthProfile {
  id: string;
  email: string | null;
  name: string | null;
}

export interface OAuthAdapter {
  getAuthUrl(state: string, codeChallenge?: string): string;
  exchangeCode(code: string, codeVerifier?: string): Promise<{ access_token: string }>;
  getUserProfile(accessToken: string): Promise<OAuthProfile>;
  generatePKCE?(): { codeVerifier: string; codeChallenge: string };
}

export class GoogleAdapter implements OAuthAdapter {
  private config = {
    get clientId() { return authConfig.oauth.google.clientId; },
    get clientSecret() { return authConfig.oauth.google.clientSecret; },
    get callbackUrl() { return authConfig.oauth.google.redirectUri; },
  };

  generatePKCE() {
    const codeVerifier = crypto.randomBytes(32).toString("base64url");
    const codeChallenge = crypto.createHash("sha256").update(codeVerifier).digest("base64url");
    return { codeVerifier, codeChallenge };
  }

  getAuthUrl(state: string, codeChallenge?: string) {
    const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    url.searchParams.append("response_type", "code");
    url.searchParams.append("state", state);
    url.searchParams.append("redirect_uri", this.config.callbackUrl!);
    url.searchParams.append("client_id", this.config.clientId!);
    url.searchParams.append("scope", "openid email profile");
    
    if (codeChallenge) {
      url.searchParams.append("code_challenge", codeChallenge);
      url.searchParams.append("code_challenge_method", "S256");
    }
    return url.toString();
  }

  async exchangeCode(code: string, codeVerifier?: string) {
    const body = new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: this.config.callbackUrl!,
      client_id: this.config.clientId!,
      client_secret: this.config.clientSecret!,
    });
    
    if (codeVerifier) body.append("code_verifier", codeVerifier);

    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });

    if (!response.ok) throw new Error("Google token exchange failed");
    return response.json();
  }

  async getUserProfile(accessToken: string): Promise<OAuthProfile> {
    const response = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    if (!response.ok) throw new Error("Google profile fetch failed");
    const data = await response.json();
    return { id: data.id, email: data.email || null, name: data.name || null };
  }
}

export class FacebookAdapter implements OAuthAdapter {
  private config = {
    get clientId() { return authConfig.oauth.facebook.clientId; },
    get clientSecret() { return authConfig.oauth.facebook.clientSecret; },
    get callbackUrl() { return authConfig.oauth.facebook.redirectUri; },
  };

  generatePKCE() {
    const codeVerifier = crypto.randomBytes(32).toString("base64url");
    const codeChallenge = crypto.createHash("sha256").update(codeVerifier).digest("base64url");
    return { codeVerifier, codeChallenge };
  }

  getAuthUrl(state: string, codeChallenge?: string) {
    const url = new URL("https://www.facebook.com/v19.0/dialog/oauth");
    url.searchParams.append("response_type", "code");
    url.searchParams.append("state", state);
    url.searchParams.append("redirect_uri", this.config.callbackUrl!);
    url.searchParams.append("client_id", this.config.clientId!);
    url.searchParams.append("scope", "email,public_profile");
    
    if (codeChallenge) {
      url.searchParams.append("code_challenge", codeChallenge);
      url.searchParams.append("code_challenge_method", "S256");
    }
    return url.toString();
  }

  async exchangeCode(code: string, codeVerifier?: string) {
    const body = new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: this.config.callbackUrl!,
      client_id: this.config.clientId!,
      client_secret: this.config.clientSecret!,
    });
    
    if (codeVerifier) body.append("code_verifier", codeVerifier);

    const response = await fetch("https://graph.facebook.com/v19.0/oauth/access_token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });

    if (!response.ok) throw new Error("Facebook token exchange failed");
    return response.json();
  }

  async getUserProfile(accessToken: string): Promise<OAuthProfile> {
    const response = await fetch("https://graph.facebook.com/me?fields=id,name,email", {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    if (!response.ok) throw new Error("Facebook profile fetch failed");
    const data = await response.json();
    if (!data.email) throw new Error("Facebook profile did not return an email address. OAuth cannot proceed.");
    return { id: data.id, email: data.email, name: data.name || null };
  }
}

export class TikTokAdapter implements OAuthAdapter {
  private config = {
    get clientKey() { return authConfig.oauth.tiktok.clientKey; },
    get clientSecret() { return authConfig.oauth.tiktok.clientSecret; },
    get callbackUrl() { return authConfig.oauth.tiktok.redirectUri; },
  };

  getAuthUrl(state: string) {
    const rootUrl = "https://www.tiktok.com/v2/auth/authorize/";
    const options: any = {
      client_key: this.config.clientKey!,
      scope: "user.info.basic",
      response_type: "code",
      redirect_uri: this.config.callbackUrl!,
      state: state,
    };
    return `${rootUrl}?${new URLSearchParams(options).toString()}`;
  }

  async exchangeCode(code: string) {
    const body: any = {
      client_key: this.config.clientKey!,
      client_secret: this.config.clientSecret!,
      code,
      grant_type: "authorization_code",
      redirect_uri: this.config.callbackUrl!,
    };

    const response = await fetch("https://open.tiktokapis.com/v2/oauth/token/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(body).toString(),
    });

    if (!response.ok) throw new Error("TikTok token exchange failed");
    return response.json();
  }

  async getUserProfile(accessToken: string): Promise<OAuthProfile> {
    const response = await fetch(
      "https://open.tiktokapis.com/v2/user/info/?fields=open_id,union_id,avatar_url,display_name",
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    const dataObj = await response.json();
    if (dataObj.error && dataObj.error.code !== "ok") throw new Error(dataObj.error.message || "TikTok profile fetch failed");
    
    // Sometimes the structure puts user inside data
    const user = dataObj.data?.user || dataObj;
    
    return {
      id: user.union_id || user.open_id,
      email: null, // TikTok basic scope doesn't guarantee email
      name: user.display_name || null,
    };
  }
}

export class OAuthAdapterFactory {
  static getAdapter(provider: "google" | "facebook" | "tiktok"): OAuthAdapter {
    switch (provider) {
      case "google": return new GoogleAdapter();
      case "facebook": return new FacebookAdapter();
      case "tiktok": return new TikTokAdapter();
      default: throw new Error(`Unsupported provider: ${provider}`);
    }
  }
}

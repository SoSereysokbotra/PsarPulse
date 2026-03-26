export const authConfig = {
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET!,
    refreshSecret: process.env.JWT_REFRESH_SECRET!,
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN!,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN!,
    verificationExpiresIn: process.env.VERIFICATION_EXPIRES_IN!,
  },
  bcrypt: {
    saltRounds: 12,
  },
  verificationCode: {
    length: 6,
    expiresInMinutes: 5,
    resendWaitTime: 60, // in seconds
  },
  cookies: {
    verificationSession: "verification_session",
    resetStep1: "reset_step1",
    resetStep2: "reset_step2",
    accessToken: "access_token",
    refreshToken: "refresh_token",
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
    },
  },
  rateLimiting: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    authWindowMs: 15 * 60 * 1000, // 15 minutes
    authMax: 10, // Limit each IP to 10 auth requests per windowMs
  },
  email: {
    host: process.env.EMAIL_HOST!,
    port: parseInt(process.env.EMAIL_PORT || "587"),
    user: process.env.EMAIL_USER!,
    pass: process.env.EMAIL_PASS!,
    from: process.env.SMTP_FROM || '"PsarPulse Support" <noreply@psarpulse.com>',
  },
  oauth: {
    google: {
      get clientId() { return process.env.GOOGLE_CLIENT_ID; },
      get clientSecret() { return process.env.GOOGLE_CLIENT_SECRET; },
      get redirectUri() { return process.env.GOOGLE_CALLBACK_URL; }
    },
    facebook: {
      get clientId() { return process.env.FACEBOOK_CLIENT_ID; },
      get clientSecret() { return process.env.FACEBOOK_CLIENT_SECRET; },
      get redirectUri() { return process.env.FACEBOOK_CALLBACK_URL; }
    },
    tiktok: {
      get clientKey() { return process.env.TIKTOK_CLIENT_KEY; },
      get clientSecret() { return process.env.TIKTOK_CLIENT_SECRET; },
      get redirectUri() { return process.env.TIKTOK_CALLBACK_URL; }
    }
  }
};

// Validate required environment variables
const requiredEnvVars = [
  "JWT_ACCESS_SECRET",
  "JWT_REFRESH_SECRET",
  "DATABASE_URL",
  "EMAIL_HOST",
  "EMAIL_USER",
  "EMAIL_PASS",
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing environment variable: ${envVar}`);
  }
}

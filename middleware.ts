import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

// Paths that don't require authentication
const publicPaths = [
  "/",
  "/login",
  "/signup",
  "/forgot",
  "/verify",
  "/vendor/register",
  "/vendor/vip",
  "/vendor/activate",
  "/admin/register",
  "/api/auth/login",
  "/api/auth/signup",
  "/api/auth/verify",
  "/api/auth/invitations",
  "/api/auth/password",
  "/api/auth/tokens/refresh",
  "/api/auth/vendor/activate",
  "/api/auth/master-login",
  "/api/auth/invitations",
  "/api/auth/oauth/google",
  "/api/auth/oauth/google/callback",
  "/api/auth/oauth/facebook",
  "/api/auth/oauth/facebook/callback",
  "/api/auth/oauth/tiktok",
  "/api/auth/oauth/tiktok/callback",
  "/admin",
  "/sw.js",
  "/manifest.webmanifest",
];

// Paths that require specific roles
const roleProtectedPaths: Record<string, string[]> = {
  "/admin": ["admin", "super_admin"],
  "/api/admin": ["admin", "super_admin"],
  "/superadmin": ["super_admin"],
  "/api/superadmin": ["super_admin"],
};

function isPublicPath(pathname: string): boolean {
  return publicPaths.some(
    (path) => pathname === path || pathname.startsWith(path + "/"),
  );
}

function getRequiredRoles(pathname: string): string[] | null {
  for (const [path, roles] of Object.entries(roleProtectedPaths)) {
    if (pathname.startsWith(path)) {
      return roles;
    }
  }
  return null;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip public paths and static files
  if (
    isPublicPath(pathname) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/icons/") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Get access token from cookie
  const accessToken = request.cookies.get("access_token")?.value;

  if (!accessToken) {
    // Redirect to login for page requests, 401 for API requests
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    // Verify token using jose (edge-compatible)
    const secret = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET!);
    const { payload } = await jwtVerify(accessToken, secret);

    // Check token type
    if (payload.type !== "access") {
      throw new Error("Invalid token type");
    }

    // Check role-based access
    const requiredRoles = getRequiredRoles(pathname);
    if (requiredRoles && !requiredRoles.includes(payload.role as string)) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json(
          { success: false, message: "Forbidden - Insufficient permissions" },
          { status: 403 },
        );
      }
      // Redirect to appropriate dashboard
      const redirectUrl = new URL("/", request.url);
      return NextResponse.redirect(redirectUrl);
    }

    // Inject user info into headers for downstream use
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", payload.id as string);
    requestHeaders.set("x-user-email", payload.email as string);
    requestHeaders.set("x-user-role", payload.role as string);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    // Token is invalid or expired
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token" },
        { status: 401 },
      );
    }
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public).*)"],
};

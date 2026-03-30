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
  "/explore",
  "/api/public",
];

// Paths that require specific roles
const roleProtectedPaths: Record<string, string[]> = {
  "/admin": ["admin", "super_admin"],
  "/api/admin": ["admin", "super_admin"],
  "/superadmin": ["super_admin"],
  "/api/superadmin": ["super_admin"],
};

// Paths that require specific subscription plans
// Plan hierarchy: premium > pro > free
// A premium user can access pro routes, but not vice versa
const planProtectedPaths: Record<string, string[]> = {
  "/vendor/pro": ["pro", "premium"],
  "/vendor/premium": ["premium"],
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

/**
 * Check if a path requires a specific subscription plan.
 * Returns the list of allowed plan names, or null if no plan restriction.
 */
function getRequiredPlans(pathname: string): string[] | null {
  for (const [path, plans] of Object.entries(planProtectedPaths)) {
    if (pathname === path || pathname.startsWith(path + "/")) {
      return plans;
    }
  }
  return null;
}

/**
 * Verify vendor's subscription plan by calling the internal API.
 * Returns { planName, subscriptionStatus, isVendor } or null on error.
 */
async function checkVendorSubscription(
  request: NextRequest,
): Promise<{
  planName: string | null;
  subscriptionStatus: string | null;
  isVendor: boolean;
} | null> {
  try {
    const checkUrl = new URL(
      "/api/vendor/subscription/check",
      request.nextUrl.origin,
    );

    const response = await fetch(checkUrl.toString(), {
      method: "GET",
      headers: {
        Cookie: request.headers.get("cookie") || "",
        "ngrok-skip-browser-warning": "true",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const result = await response.json();
    if (result.success) {
      return result.data;
    }
    return null;
  } catch (error) {
    console.error("Middleware subscription check failed:", error);
    return null;
  }
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

    // Check plan-based access for vendor routes
    const requiredPlans = getRequiredPlans(pathname);
    if (requiredPlans) {
      const subscriptionData = await checkVendorSubscription(request);

      // If we couldn't verify subscription, deny access (fail-closed)
      if (!subscriptionData || !subscriptionData.isVendor) {
        if (pathname.startsWith("/api/")) {
          return NextResponse.json(
            {
              success: false,
              message: "Forbidden - Vendor account required",
            },
            { status: 403 },
          );
        }
        const pricingUrl = new URL("/vendor/pricing", request.url);
        return NextResponse.redirect(pricingUrl);
      }

      // Check if subscription is active
      const activeStatuses = ["active", "trial"];
      if (
        !subscriptionData.subscriptionStatus ||
        !activeStatuses.includes(subscriptionData.subscriptionStatus)
      ) {
        if (pathname.startsWith("/api/")) {
          return NextResponse.json(
            {
              success: false,
              message:
                "Forbidden - Active subscription required. Please renew your plan.",
            },
            { status: 403 },
          );
        }
        const pricingUrl = new URL("/vendor/pricing", request.url);
        pricingUrl.searchParams.set("reason", "expired");
        return NextResponse.redirect(pricingUrl);
      }

      // Check if vendor's plan is in the list of allowed plans
      if (
        !subscriptionData.planName ||
        !requiredPlans.includes(subscriptionData.planName)
      ) {
        if (pathname.startsWith("/api/")) {
          return NextResponse.json(
            {
              success: false,
              message: `Forbidden - This feature requires a ${requiredPlans[0]} plan or higher.`,
            },
            { status: 403 },
          );
        }
        const pricingUrl = new URL("/vendor/pricing", request.url);
        pricingUrl.searchParams.set("reason", "upgrade");
        return NextResponse.redirect(pricingUrl);
      }
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

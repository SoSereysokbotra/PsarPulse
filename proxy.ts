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
  "/api/bakong/webhook",
  "/admin",
  "/api/test_db",
  "/sw.js",
  "/manifest.webmanifest",
  "/explore",
  "/guest",
  "/api/public",
  "/api/upload",
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

const SUBSCRIPTION_CACHE_COOKIE = "psarpulse-subscription-cache";
const SUBSCRIPTION_CACHE_TTL_MS = 60_000;
const SUBSCRIPTION_CACHE_MAX_AGE_SECONDS = 60;

type SubscriptionData = {
  planName: string | null;
  subscriptionStatus: string | null;
  isVendor: boolean;
};

type CachedSubscriptionData = SubscriptionData & {
  ts: number;
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
): Promise<SubscriptionData | null> {
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

function getCachedSubscription(request: NextRequest): SubscriptionData | null {
  const cached = request.cookies.get(SUBSCRIPTION_CACHE_COOKIE)?.value;
  if (!cached) return null;

  try {
    const parsed = JSON.parse(
      decodeURIComponent(cached),
    ) as CachedSubscriptionData;
    if (!parsed || typeof parsed.ts !== "number") return null;

    const isFresh = Date.now() - parsed.ts < SUBSCRIPTION_CACHE_TTL_MS;
    if (!isFresh) return null;

    return {
      planName: parsed.planName ?? null,
      subscriptionStatus: parsed.subscriptionStatus ?? null,
      isVendor: Boolean(parsed.isVendor),
    };
  } catch {
    return null;
  }
}

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  let subscriptionDataToCache: SubscriptionData | null = null;

  const attachSubscriptionCache = (
    response: NextResponse,
    subscriptionData?: SubscriptionData | null,
  ) => {
    const dataToCache = subscriptionData ?? subscriptionDataToCache;
    if (!dataToCache) return response;

    const value = encodeURIComponent(
      JSON.stringify({ ...dataToCache, ts: Date.now() }),
    );
    response.cookies.set(SUBSCRIPTION_CACHE_COOKIE, value, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: SUBSCRIPTION_CACHE_MAX_AGE_SECONDS,
    });
    return response;
  };

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
    const isFreeVendorPath =
      pathname === "/vendor" ||
      /^\/vendor\/(sales|expenses|inventory|customer|reports|settings)$/.test(
        pathname,
      );

    if (requiredPlans || isFreeVendorPath) {
      let subscriptionData = getCachedSubscription(request);
      const hadCachedSubscription = Boolean(subscriptionData);
      if (!subscriptionData) {
        subscriptionData = await checkVendorSubscription(request);
        if (subscriptionData) {
          subscriptionDataToCache = subscriptionData;
        }
      }

      const refreshSubscriptionData = async () => {
        const fresh = await checkVendorSubscription(request);
        if (fresh) {
          subscriptionData = fresh;
          subscriptionDataToCache = fresh;
        }
        return fresh;
      };
      console.log(
        `[Middleware] Path: ${pathname}, Plan Data:`,
        subscriptionData,
      );

      // Handle auto-redirect for free dashboard paths if vendor has a higher plan
      if (
        isFreeVendorPath &&
        subscriptionData?.isVendor &&
        subscriptionData.subscriptionStatus &&
        ["active", "trial"].includes(subscriptionData.subscriptionStatus)
      ) {
        const planName = subscriptionData.planName;
        if (planName === "premium" || planName === "pro") {
          const isProExempt =
            planName === "pro" && pathname.endsWith("/settings");
          if (!isProExempt) {
            const targetPath =
              pathname === "/vendor"
                ? `/vendor/${planName}`
                : pathname.replace("/vendor", `/vendor/${planName}`);
            return attachSubscriptionCache(
              NextResponse.redirect(new URL(targetPath, request.url)),
              subscriptionData,
            );
          }
        }
      }

      if (requiredPlans) {
        // If we couldn't verify subscription, deny access (fail-closed)
        if (!subscriptionData || !subscriptionData.isVendor) {
          if (hadCachedSubscription) {
            await refreshSubscriptionData();
          }

          if (!subscriptionData || !subscriptionData.isVendor) {
            console.log(
              `[Middleware] Redirecting to pricing: No subscription or not vendor`,
            );
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
            return attachSubscriptionCache(NextResponse.redirect(pricingUrl));
          }
        }

        // Check if subscription is active
        const activeStatuses = ["active", "trial"];
        if (
          !subscriptionData.subscriptionStatus ||
          !activeStatuses.includes(subscriptionData.subscriptionStatus)
        ) {
          if (hadCachedSubscription) {
            await refreshSubscriptionData();
          }

          if (
            !subscriptionData?.subscriptionStatus ||
            !activeStatuses.includes(subscriptionData.subscriptionStatus)
          ) {
            console.log(
              `[Middleware] Redirecting to pricing: Status is ${subscriptionData.subscriptionStatus}`,
            );
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
            return attachSubscriptionCache(NextResponse.redirect(pricingUrl));
          }
        }

        // Check if vendor's plan is in the list of allowed plans
        if (
          !subscriptionData.planName ||
          !requiredPlans.includes(subscriptionData.planName)
        ) {
          if (hadCachedSubscription) {
            await refreshSubscriptionData();
          }

          if (
            !subscriptionData?.planName ||
            !requiredPlans.includes(subscriptionData.planName)
          ) {
            console.log(
              `[Middleware] Redirecting to pricing: Plan mismatch. Required: ${requiredPlans.join(",")}, Found: ${subscriptionData.planName}`,
            );

            // If this is an internal data fetch (/api/), return 403 JSON instead of 307 Redirect
            // to avoid "enqueueModel" hydration errors in the browser.
            if (pathname.startsWith("/api/")) {
              return NextResponse.json(
                {
                  success: false,
                  message: `Forbidden - This feature requires a ${requiredPlans[0] || "higher"} plan.`,
                },
                { status: 403 },
              );
            }
            const pricingUrl = new URL("/vendor/pricing", request.url);
            pricingUrl.searchParams.set("reason", "upgrade");
            return attachSubscriptionCache(NextResponse.redirect(pricingUrl));
          }
        }
        console.log(`[Middleware] Access granted to ${pathname}`);
      }
    }

    // Inject user info into headers for downstream use
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", payload.id as string);
    requestHeaders.set("x-user-email", payload.email as string);
    requestHeaders.set("x-user-role", payload.role as string);

    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

    return attachSubscriptionCache(response);
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

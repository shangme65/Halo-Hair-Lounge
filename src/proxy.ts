import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Rate limiting store (in-memory, resets on server restart)
// For production, consider using Redis or a database
const rateLimitStore = new Map<
  string,
  { count: number; lastReset: number; blocked: boolean; blockUntil: number }
>();

// Rate limit configuration
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 100; // General API limit
const AUTH_MAX_REQUESTS = 5; // Auth endpoints limit (stricter)
const BLOCK_DURATION = 5 * 60 * 1000; // 5 minutes block for abuse

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  const realIp = req.headers.get("x-real-ip");
  return forwarded?.split(",")[0]?.trim() || realIp || "unknown";
}

function checkRateLimit(
  ip: string,
  path: string,
  isAuthEndpoint: boolean
): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const key = `${ip}:${isAuthEndpoint ? "auth" : "general"}`;
  const limit = isAuthEndpoint ? AUTH_MAX_REQUESTS : MAX_REQUESTS_PER_WINDOW;

  let record = rateLimitStore.get(key);

  // Check if blocked
  if (record?.blocked && record.blockUntil > now) {
    return {
      allowed: false,
      remaining: 0,
      resetIn: Math.ceil((record.blockUntil - now) / 1000),
    };
  }

  // Reset if window has passed or new record
  if (!record || now - record.lastReset > RATE_LIMIT_WINDOW) {
    record = { count: 1, lastReset: now, blocked: false, blockUntil: 0 };
    rateLimitStore.set(key, record);
    return { allowed: true, remaining: limit - 1, resetIn: 60 };
  }

  // Check if over limit
  if (record.count >= limit) {
    // Block repeated abusers
    if (record.count >= limit * 2) {
      record.blocked = true;
      record.blockUntil = now + BLOCK_DURATION;
      rateLimitStore.set(key, record);
    }
    return {
      allowed: false,
      remaining: 0,
      resetIn: Math.ceil((record.lastReset + RATE_LIMIT_WINDOW - now) / 1000),
    };
  }

  // Increment counter
  record.count++;
  rateLimitStore.set(key, record);
  return {
    allowed: true,
    remaining: limit - record.count,
    resetIn: Math.ceil((record.lastReset + RATE_LIMIT_WINDOW - now) / 1000),
  };
}

// Clean up old entries periodically (every 10 minutes)
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (
      now - record.lastReset > RATE_LIMIT_WINDOW * 2 &&
      (!record.blocked || record.blockUntil < now)
    ) {
      rateLimitStore.delete(key);
    }
  }
}, 10 * 60 * 1000);

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;
    const ip = getClientIp(req);

    // Check rate limiting for API routes
    if (path.startsWith("/api/")) {
      const isAuthEndpoint =
        path.includes("/auth/") || path.includes("/signin");
      const { allowed, remaining, resetIn } = checkRateLimit(
        ip,
        path,
        isAuthEndpoint
      );

      if (!allowed) {
        return NextResponse.json(
          {
            error: "Too many requests. Please try again later.",
            retryAfter: resetIn,
          },
          {
            status: 429,
            headers: {
              "Retry-After": String(resetIn),
              "X-RateLimit-Remaining": "0",
              "X-RateLimit-Reset": String(resetIn),
            },
          }
        );
      }

      // Add rate limit headers to successful responses
      const response = NextResponse.next();
      response.headers.set("X-RateLimit-Remaining", String(remaining));
      response.headers.set("X-RateLimit-Reset", String(resetIn));
    }

    // Admin portal protection - only ADMIN can access
    if (path.startsWith("/halo-admin-portal-2024")) {
      if (!token || token.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/auth/signin", req.url));
      }
    }

    // Admin API protection
    if (path.startsWith("/api/halo-admin-api")) {
      if (!token || token.role !== "ADMIN") {
        return NextResponse.json(
          { error: "Forbidden - Admin access required" },
          { status: 403 }
        );
      }
    }

    // Protected page content update APIs (hero, cta, faq, etc.) - only ADMIN
    const contentUpdatePaths = [
      "/api/hero",
      "/api/cta",
      "/api/faq",
      "/api/features",
      "/api/testimonials",
      "/api/why-choose-us",
    ];

    if (
      req.method !== "GET" &&
      contentUpdatePaths.some((p) => path.startsWith(p))
    ) {
      if (!token || token.role !== "ADMIN") {
        return NextResponse.json(
          { error: "Forbidden - Admin access required" },
          { status: 403 }
        );
      }
    }

    // Upload endpoint protection - only ADMIN can upload
    if (path === "/api/upload" && req.method === "POST") {
      if (!token || token.role !== "ADMIN") {
        return NextResponse.json(
          { error: "Forbidden - Admin access required" },
          { status: 403 }
        );
      }
    }

    // Admin setup route protection - disable after initial setup
    // This route should only be accessible if no admin exists
    if (path === "/api/auth/admin-setup") {
      // Allow the route to handle its own validation
      // But add rate limiting (handled above)
      return NextResponse.next();
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;

        // Public routes that don't require authentication
        const publicRoutes = [
          "/",
          "/about",
          "/services",
          "/products",
          "/contact",
          "/book",
          "/privacy",
          "/terms",
          "/site-map",
          "/auth/signin",
          "/auth/error",
          "/admin-setup",
        ];

        // Public API routes (GET only for most)
        const publicApiRoutes = [
          "/api/services",
          "/api/products",
          "/api/hero",
          "/api/cta",
          "/api/faq",
          "/api/features",
          "/api/testimonials",
          "/api/why-choose-us",
          "/api/service-categories",
          "/api/product-categories",
          "/api/auth",
        ];

        // Check if it's a public route
        if (publicRoutes.some((route) => path === route)) {
          return true;
        }

        // Check if it's a public API route
        if (publicApiRoutes.some((route) => path.startsWith(route))) {
          return true;
        }

        // Appointments API allows POST without auth (guest booking)
        if (path === "/api/appointments" && req.method === "POST") {
          return true;
        }

        // All other routes require authentication
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files (images, etc.)
     * - robots.txt
     * - sw.js (service worker)
     */
    "/((?!_next/static|_next/image|favicon.ico|uploads|robots.txt|sw.js|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$|.*\\.ico$|.*\\.webp$).*)",
  ],
};

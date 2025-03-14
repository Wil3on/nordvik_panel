import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

// Define routes that require admin access
const ADMIN_ROUTES = ["/users", "/nodes"];

// Define routes that require authentication
const AUTH_ROUTES = [
  "/dashboard",
  "/profile",
  "/servers",
  "/games",
  "/settings",
  ...ADMIN_ROUTES,
];

// Define public routes
const PUBLIC_ROUTES = ["/login", "/register"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the route is a public route
  if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
    // If user is already authenticated, redirect to dashboard
    const token = await getToken({ req: request });
    if (token) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // Check if the route requires authentication
  if (AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
    const token = await getToken({ req: request });
    
    // If not authenticated, redirect to login
    if (!token) {
      const url = new URL("/login", request.url);
      url.searchParams.set("callbackUrl", encodeURI(pathname));
      return NextResponse.redirect(url);
    }
    
    // Check if the route requires admin access
    if (ADMIN_ROUTES.some((route) => pathname.startsWith(route))) {
      // If not admin, redirect to dashboard
      if (token.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }
  }

  // For the root path, redirect to dashboard if authenticated, otherwise to login
  if (pathname === "/") {
    const token = await getToken({ req: request });
    if (token) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    // Let the home page handle the redirect to login
    return NextResponse.next();
  }

  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all paths except:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /static (public files)
     * 4. /logo.svg (favicon)
     */
    "/((?!api|_next|static|logo.svg).*)",
  ],
};

import { NextResponse } from "next/server"

/**
 * Middleware function to protect routes
 * Redirects unauthenticated users to login page
 */
export function middleware(request) {
  // Get token from cookies
  const token = request.cookies.get("token")?.value

  // Get the pathname
  const { pathname } = request.nextUrl

  // Define public routes that don't require authentication
  const publicRoutes = ["/login", "/register", "/forgot-password", "/reset-password"]

  // Check if the route is public
  const isPublicRoute = publicRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`))

  // If no token and trying to access a protected route, redirect to login
  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // If token exists and trying to access login/register, redirect to dashboard
  if (token && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

/**
 * Configure which routes should be processed by the middleware
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes
     */
    "/((?!_next/static|_next/image|favicon.ico|public|api).*)",
  ],
}

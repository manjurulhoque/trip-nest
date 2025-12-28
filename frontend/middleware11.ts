import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const path = req.nextUrl.pathname;

        // Public routes - accessible to all
        if (
            path === "/" ||
            path.startsWith("/auth/") ||
            path.startsWith("/api/auth/") ||
            path.startsWith("/_next/") ||
            path.startsWith("/static/") ||
            path.includes(".")
        ) {
            return NextResponse.next();
        }

        // Protected routes - require authentication
        if (!token) {
            return NextResponse.redirect(new URL("/auth/login", req.url));
        }

        // Role-based route protection
        const user = token.user;

        // Admin routes
        if (path.startsWith("/admin") && !user.is_superuser) {
            return NextResponse.redirect(new URL("/dashboard", req.url));
        }

        // Host routes
        if (path.startsWith("/host") && user.role !== "host") {
            return NextResponse.redirect(new URL("/dashboard", req.url));
        }

        // Guest routes
        if (path.startsWith("/guest") && user.role !== "guest") {
            return NextResponse.redirect(new URL("/dashboard", req.url));
        }

        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
    }
);

// Specify which routes to protect
export const config = {
    matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico|public/).*)"],
};

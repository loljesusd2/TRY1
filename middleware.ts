
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Public routes that don't require authentication
    const publicRoutes = ['/', '/auth/login', '/auth/register', '/api/auth'];
    const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

    // If user is not authenticated and trying to access protected route
    if (!token && !isPublicRoute) {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }

    // If user is authenticated but not approved (for professionals)
    if (token && token.role === 'PROFESSIONAL' && !token.isApproved) {
      if (!pathname.startsWith('/pending-approval') && !pathname.startsWith('/auth') && !pathname.startsWith('/api/auth')) {
        return NextResponse.redirect(new URL('/pending-approval', req.url));
      }
    }

    // Role-based route protection
    if (token) {
      // Admin-only routes
      if (pathname.startsWith('/admin') && token.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/', req.url));
      }

      // Professional-only routes
      if ((pathname.startsWith('/dashboard') || pathname.startsWith('/earnings')) && 
          token.role !== 'PROFESSIONAL' && token.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/', req.url));
      }

      // Redirect authenticated users away from auth pages
      if (pathname.startsWith('/auth/') && pathname !== '/auth/logout') {
        return NextResponse.redirect(new URL('/', req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to public routes without token
        const { pathname } = req.nextUrl;
        const publicRoutes = ['/', '/auth/login', '/auth/register', '/api/auth'];
        const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
        
        return isPublicRoute || !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.ico|images|uploads).*)',
  ],
};

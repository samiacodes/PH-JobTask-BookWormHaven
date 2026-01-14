// proxy.ts - Authentication and admin protection
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  const token = await getToken({ req: request });
  const { pathname } = request.nextUrl;

  // Check if this is an admin route
  const isAdminRoute = pathname.startsWith('/admin') || pathname.startsWith('/api/admin');
  
  // For API routes, we'll handle authentication differently
  const isApiRoute = pathname.startsWith('/api/');

  // If accessing admin route, verify admin role
  if (isAdminRoute) {
    // For admin API routes, return JSON error instead of redirect
    if (pathname.startsWith('/api/admin')) {
      if (!token || token.role !== 'admin') {
        return NextResponse.json(
          { message: 'Forbidden: Admin access required' },
          { status: 403 }
        );
      }
      // Admin is authenticated, allow access to API
      return NextResponse.next();
    } else {
      // For admin page routes, redirect if not authenticated
      if (!token || token.role !== 'admin') {
        // Redirect to login if not authenticated
        if (!token) {
          const loginUrl = new URL('/login', request.url);
          loginUrl.searchParams.set('callbackUrl', pathname);
          return NextResponse.redirect(loginUrl);
        }
        // Return 403 for non-admins trying to access admin routes
        return NextResponse.json(
          { message: 'Forbidden: Admin access required' },
          { status: 403 }
        );
      }
      // Admin is authenticated, allow access to pages
      return NextResponse.next();
    }
  }

  // Public routes (no login required)
  const publicRoutes = ['/login', '/register', '/api/auth', '/forgot-password'];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  // If accessing root and not logged in, redirect to login
  if (pathname === '/' && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If not logged in and trying to access protected route
  if (!token && !isPublicRoute) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If logged in and trying to access auth pages
  if (token && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/', request.url)); 
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next|api\/auth|.*\.(?:png|jpg|jpeg|svg|webp|gif|ico)$).*)',
  ],
};

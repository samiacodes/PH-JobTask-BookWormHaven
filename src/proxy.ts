// middleware.ts
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  const token = await getToken({ req: request });
  const { pathname } = request.nextUrl;

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

// export const config = {
//   matcher: [
//     '/((?!_next/static|_next/image|favicon.ico|public).*)',
//   ],
// };

export const config = {
  matcher: [
    '/((?!_next|api|.*\\.(?:png|jpg|jpeg|svg|webp|gif|ico)$).*)',
  ],
};

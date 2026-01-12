// app/api/auth/error/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Get the error from query parameters
  const searchParams = request.nextUrl.searchParams;
  const error = searchParams.get('error');
  
  // Redirect to login page with the error
  const loginUrl = new URL('/login', request.url);
  
  if (error) {
    loginUrl.searchParams.set('error', error);
  }
  
  return NextResponse.redirect(loginUrl);
}
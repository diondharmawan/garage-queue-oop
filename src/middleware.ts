import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow access to admin login page
  if (pathname === '/admin/login') {
    return NextResponse.next();
  }

  // Check for admin session cookie or Supabase auth token
  const adminSession = request.cookies.get('admin_session')?.value;
  const supabaseAuthToken = request.cookies.get('sb-access-token')?.value || request.cookies.get('supabase-auth-token')?.value;

  const isAuthenticated = Boolean(adminSession || supabaseAuthToken);

  // If user is unauthenticated and attempting to access /admin/*, redirect to /admin/login
  if (!isAuthenticated && pathname.startsWith('/admin')) {
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};

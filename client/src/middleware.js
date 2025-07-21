import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get('token')?.value;

  // Define public routes
  const isPublicRoute =
    path === '/login' ||
     path === '/login-error' ||
    path === '/signup' ||
    path === '/verifyotp' ||
    path === '/' ||
    path.startsWith('/events') ||
    path.startsWith('/event/');

  // Allow public routes without a token
  if (isPublicRoute && !token) {
    return NextResponse.next();
  }

  // Redirect to login for non-public routes if no token
  if (!token) {
    return NextResponse.redirect(new URL('/login-error', request.url));
  }

  try {
    // Verify JWT
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'vishesh456');
    const { payload } = await jwtVerify(token, secret);
    const { r } = payload;
    const role = r;

    // Redirect authenticated users from login/signup to their respective dashboards
    if (path === '/login' || path === '/signup') {
      if (role === 'admin') {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }
      if (role === 'user') {
        return NextResponse.redirect(new URL('/', request.url));
      }
    }

    // Prevent admin from accessing the homepage
    if (path === '/' && role === 'admin') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }

    // Role-based access control
    if (path.startsWith('/admin') && role !== 'admin') {
      return NextResponse.redirect(new URL('/login-error', request.url));
    }

    if (path.startsWith('/user') && role !== 'user') {
      return NextResponse.redirect(new URL('/login-error', request.url));
    }

    // Allow access to the requested route
    return NextResponse.next();
  } catch (error) {
    console.error('JWT verification error:', error.message);
    // Clear the token cookie on invalid token to prevent loops
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('token');
    return response;
  }
}

export const config = {
  matcher: [
    '/',
    '/admin/:path*',
    '/user/:path*',
    '/login',
    '/login-error',
    '/signup',
    '/verifyotp',
    '/events/:path*',
    '/event/:path*',
  ],
};
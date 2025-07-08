import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get('token')?.value;
// console.log("token",token);

  // Define public routes
  const isPublicRoute = path === '/login' || path === '/signup';

  // Allow public routes without a token
  if (isPublicRoute && !token) {
    console.log("not publi route nad no token found");
    
    return NextResponse.next();
  }

  // Redirect to login for non-public routes if no token
  if (!token) {
    console.log("no token found");

    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    // Verify JWT
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'vishesh456');
    const { payload } = await jwtVerify(token, secret);
    const { r } = payload;
    const role = r
    // console.log("role",role)
    // console.log("payload",payload);
    
    // Redirect authenticated users from public routes to their dashboard
    if (isPublicRoute && role) {
      const dashboardPath = `/${role}/dashboard`;
      return NextResponse.redirect(new URL(dashboardPath, request.url));
    }

    // Role-based access control
    if (path.startsWith('/admin') && role !== 'admin') {
      return NextResponse.redirect(new URL('/login', request.url)); // Redirect to login instead of /user/dashboard
    }

    if (path.startsWith('/user') && role !== 'user') {
      return NextResponse.redirect(new URL('/login', request.url)); // Redirect to login instead of /admin/dashboard
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
  matcher: ['/admin/:path*', '/user/:path*', '/login', '/signup'],
};
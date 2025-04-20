import { NextResponse } from 'next/server';

export function middleware(request) {
  // Get the path the user is trying to access
  const path = request.nextUrl.pathname;
  
  // Define admin routes that should be protected
  const isAdminRoute = path.startsWith('/admin') || path.startsWith('/dashboard');
  
  // Define user routes that should be protected (require any login)
  const isUserRoute = path.startsWith('/cart') || path.startsWith('/testdrive') || path.startsWith('/sell');
  
  // Check if the user is logged in
  const userCookie = request.cookies.get('user');
  
  // If no user cookie exists for protected routes
  if (!userCookie) {
    // Redirect to login if trying to access admin or user routes
    if (isAdminRoute || isUserRoute) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  } else {
    try {
      // Parse the user cookie
      const userData = JSON.parse(userCookie.value);
      
      // If user is trying to access admin route but is not admin
      if (isAdminRoute && !userData.isAdmin) {
        return NextResponse.redirect(new URL('/home', request.url));
      }
    } catch (error) {
      // If cookie parsing fails, redirect to login
      console.error('Failed to parse user cookie:', error);
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  return NextResponse.next();
}

// Configure which routes the middleware runs on
export const config = {
  matcher: [
    '/dashboard', 
    '/admin/:path*',
    '/cart',
    '/profile',
    '/testdrive',
    '/sell',
    '/payment-success',
    '/payment-failed'
  ]
};
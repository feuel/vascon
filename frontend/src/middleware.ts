import { NextRequest, NextResponse } from 'next/server';
import { getSession } from './app/utils/session';

const protectedRoutes = ['/dashboard'];
const publicRoutes = ['/', '/login', '/create'];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);
  const token = getSession();

  // Redirect to /login if the user is not authenticated
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', req.nextUrl));
  }

  // Redirect to / if the user is authenticated
  if (isPublicRoute && token && !req.nextUrl.pathname.startsWith('/')) {
    return NextResponse.redirect(new URL('/', req.nextUrl));
  }

  if (token && path === '/login')
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl));

  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};

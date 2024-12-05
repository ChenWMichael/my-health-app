import { NextResponse } from 'next/server';

export function middleware(req) {
  const isAuthenticated = req.cookies.get('isAuthenticated')?.value;

  if (req.nextUrl.pathname === '/log' && !isAuthenticated) {
    return NextResponse.redirect(new URL('/admin', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/log'],
};
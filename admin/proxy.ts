import { NextRequest, NextResponse } from 'next/server';

export function proxy(req: NextRequest) {
  const isLoggedIn = req.cookies.get('admin_session')?.value === 'authenticated';
  const isLoginPage = req.nextUrl.pathname === '/login';

  if (!isLoggedIn && !isLoginPage) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  if (isLoggedIn && isLoginPage) {
    return NextResponse.redirect(new URL('/protocols', req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|favicon.ico).*)'],
};

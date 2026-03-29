import { NextResponse } from 'next/server';

export function middleware(request) {
  const isLoginPage = request.nextUrl.pathname === '/login';
  
  // Pretpostavimo da javni fajlovi i api rute preskočimo, ali ovde samo logiku radimo
  const authCookie = request.cookies.get('auth_session');

  if (!authCookie && !isLoginPage) {
    // Redirekcija ukoliko korisnik nije ulogovan
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (authCookie && isLoginPage) {
    // Ako je već ulogovan a ide na login, prebaci na dashboard
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Primeni posvuda osim na Next.js interni fajlovi (_next) i statiku
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
};

import { type NextRequest } from 'next/server';
import { getSession } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const session = await getSession();
  const { pathname } = request.nextUrl;

  // If user is trying to access admin routes without a session, redirect to login
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login') && !session) {
    return Response.redirect(new URL('/admin/login', request.url));
  }

  // If user is logged in and tries to access login page, redirect to admin dashboard
  if (pathname.startsWith('/admin/login') && session) {
    return Response.redirect(new URL('/admin', request.url));
  }

  return;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};

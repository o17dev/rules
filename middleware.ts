import { i18nRouter } from 'next-i18n-router';
import i18nConfig from './i18nConfig';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from "@/auth";

// Routes that require authentication
const protectedRoutes = ['/submit', '/live', '/admin', '/prompts'];

export default auth((req) => {
  const { nextUrl } = req;
  const isProtectedRoute = protectedRoutes.some(route => 
    nextUrl.pathname.includes(route) || 
    nextUrl.pathname.replace(/^\/[^/]+/, '').includes(route) // Handle routes with language prefix
  );

  // If it is a protected route, check authentication
  if (isProtectedRoute) {
    const { auth: session } = req;
    if (!session) {
      // If not authenticated, redirect to the login page
      return NextResponse.redirect(new URL('/login', req.url));
    }
    if (nextUrl.pathname.includes('/admin')) {
      const adminEmails = process.env.ADMIN_EMAILS?.split(',') || []
      if (! session?.user?.email || !adminEmails.includes(session?.user?.email)) {
        return NextResponse.redirect(new URL('/', req.url));
      }
    }
  }

  // Apply i18n routing
  return i18nRouter(req, i18nConfig);
})

// Configure routes that the middleware matches
export const config = {
  matcher: [
    // i18n routes
    '/((?!api|_next|_vercel|.*\\..*).*)',
    // Routes that need protection
    '/submit',
    '/live',
    '/admin',
    '/prompts',
    // Routes that need to match language prefix
    '/:locale/submit',
    '/:locale/live',
    '/:locale/admin',
    '/:locale/prompts',
  ],
}

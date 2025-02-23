import createMiddleware from 'next-intl/middleware';
import { routing, locales } from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';

const defaultUrl = '/content/profil-pisma';

const handleI18nRouting = createMiddleware(routing);

const constructRedirect = (pathname: string): string | null => {
  let parts = pathname.split('/').filter(Boolean);

  let isRequestToApi = (parts: string[]) =>
    parts.length !== 0 && parts[0] === 'api';
  let isRequestToPartialUrl = (parts: string[]) =>
    parts.length === 0 || (parts.length === 1 && parts[0] == 'content');

  if (isRequestToApi(parts)) {
    return null;
  }
  if (isRequestToPartialUrl(parts)) {
    return defaultUrl;
  }
  if (isRequestToPartialUrl(parts.slice(1)) && locales.includes(parts[0])) {
    return `/${parts[0]}${defaultUrl}`;
  }

  return null;
};

export default async function middleware(request: NextRequest) {
  let redirectedUrl = constructRedirect(request.nextUrl.pathname);

  if (redirectedUrl) {
    const newUrl = request.nextUrl.clone();
    newUrl.pathname = redirectedUrl;
    return NextResponse.redirect(newUrl);
  }

  return handleI18nRouting(request);
}

export const config = {
  // Skip all paths that should not be internationalized. This example skips the
  // folders "api", "_next" and all files with an extension (e.g. favicon.ico)
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};

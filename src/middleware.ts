import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { defaultLocale, isLocale } from "@/i18n/config";

const LOCALE_COOKIE = "NEXT_LOCALE";

function shouldSuggestGermanHome(request: NextRequest): boolean {
  if (request.cookies.get(LOCALE_COOKIE)?.value) {
    return false;
  }
  const accept = request.headers.get("accept-language") ?? "";
  return accept.toLowerCase().includes("de");
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".") // static files
  ) {
    return NextResponse.next();
  }

  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0];

  if (first && isLocale(first) && first !== defaultLocale) {
    const response = NextResponse.next();
    response.cookies.set(LOCALE_COOKIE, first, { path: "/", sameSite: "lax" });
    return response;
  }

  if (first === defaultLocale) {
    const rest = segments.slice(1).join("/");
    const url = request.nextUrl.clone();
    url.pathname = rest ? `/${rest}` : "/";
    const response = NextResponse.redirect(url);
    response.cookies.set(LOCALE_COOKIE, defaultLocale, { path: "/", sameSite: "lax" });
    return response;
  }

  // Unprefixed URLs are canonical English. Only suggest /de on first visit to /.
  if (pathname === "/" && shouldSuggestGermanHome(request)) {
    const url = request.nextUrl.clone();
    url.pathname = "/de";
    const response = NextResponse.redirect(url);
    response.cookies.set(LOCALE_COOKIE, "de", { path: "/", sameSite: "lax" });
    return response;
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;

  const response = NextResponse.rewrite(url);
  response.cookies.set(LOCALE_COOKIE, defaultLocale, { path: "/", sameSite: "lax" });
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|og.svg).*)"],
};

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { defaultLocale, isLocale, type Locale } from "@/i18n/config";

const LOCALE_COOKIE = "NEXT_LOCALE";

function pickLocale(request: NextRequest): Locale {
  const cookie = request.cookies.get(LOCALE_COOKIE)?.value;
  if (cookie && isLocale(cookie)) {
    return cookie;
  }

  const accept = request.headers.get("accept-language") ?? "";
  if (accept.toLowerCase().includes("de")) {
    return "de";
  }

  return defaultLocale;
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
    return NextResponse.redirect(url);
  }

  const locale = pickLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;

  const response = NextResponse.rewrite(url);
  response.cookies.set(LOCALE_COOKIE, locale, { path: "/", sameSite: "lax" });
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|og.svg).*)"],
};

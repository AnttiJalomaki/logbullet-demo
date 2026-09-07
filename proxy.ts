import { NextResponse, type NextRequest } from "next/server"
import { isLocale, preferredLocale } from "./lib/i18n"
export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  if (isLocale(pathname.split("/")[1])) return NextResponse.next()
  // Keep unsupported locale URLs as 404s rather than nesting another prefix.
  if (/^\/[a-z]{2}(?:\/|$)/.test(pathname)) return NextResponse.next()
  const cookie = request.cookies.get("logbullet-locale")?.value
  const locale =
    cookie && isLocale(cookie)
      ? cookie
      : preferredLocale(request.headers.get("accept-language"))
  const url = request.nextUrl.clone()
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`
  return NextResponse.redirect(url)
}
export const config = { matcher: ["/((?!api|_next|.*\\..*).*)"] }

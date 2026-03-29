import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = [
  "/dashboard",
  "/transactions",
  "/goals",
  "/ai",
  "/passport",
  "/settings",
  "/notifications",
];
const authRoutes = ["/login", "/register"];

export function proxy(request: NextRequest) {
  const hasSession =
    request.cookies.get("paypath_has_session")?.value === "1";
  const { pathname } = request.nextUrl;

  if (
    !hasSession &&
    protectedRoutes.some((route) => pathname.startsWith(route))
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (hasSession && authRoutes.some((route) => pathname === route)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

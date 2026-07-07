import { NextRequest, NextResponse } from "next/server";

const DOMINIO_LANDING_PAGE = "lp-nathanwexell-bio.vercel.app";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";
  if (host.includes(DOMINIO_LANDING_PAGE) && request.nextUrl.pathname === "/") {
    return NextResponse.rewrite(new URL("/resgate", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/",
};

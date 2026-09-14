import { NextRequest, NextResponse } from "next/server";
import { verifySession, SESSION_COOKIE_NAME } from "@/lib/auth";

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // /command-center itself renders its own login form — only guard deeper admin routes.
  if (path === "/command-center") return NextResponse.next();

  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = await verifySession(token);
  if (!session) {
    return NextResponse.redirect(new URL("/command-center", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/command-center/:path+"],
};
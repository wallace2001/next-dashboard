import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import authOptions from "./app/api/auth/[...nextauth]/options";
import { authRoutes } from "../routes";


const { auth } = NextAuth(authOptions);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isAuthRoute) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/", nextUrl));
    }
    return null;
  }

  return null;
})
export const config = { matcher: ["/dashboard/:path*", "/profile/:path*"] };

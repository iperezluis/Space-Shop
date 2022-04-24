import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
// import { jwt } from "../../utils";

export async function middleware(req: NextRequest | any, ev: NextFetchEvent) {
  //Scope  for execute funcions before go next page
  //  note: if you want to protect routes for just admin you can to extract of session  session.user.role !== "admin" return NextResponse.redirect()
  const session = await getToken({ req });
  console.log(session);
  //if the NexthAuth token is not coming
  if (!session) {
    const { pathname, origin } = req.nextUrl.clone();
    return NextResponse.redirect(`${origin}/auth/login?p=${pathname}`);
  }
  return NextResponse.next();

  // const { token = "" } = req.cookies;
  // const ip = req.ip;
  // try {
  //   await jwt.verifyJWT(token);
  //   console.log({ ip });
  //   return NextResponse.next();
  // } catch (error) {
  //   // const requestedPage = req.page.name;
  //   const { pathname, origin } = req.nextUrl.clone();
  //   return NextResponse.redirect(`${origin}/auth/login?p=${pathname}`);
  // }
}

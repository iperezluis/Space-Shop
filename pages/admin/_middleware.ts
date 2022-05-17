import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
// import { jwt } from "../../utils";

export async function middleware(req: NextRequest | any, ev: NextFetchEvent) {
  const session: any = await getToken({ req });
  console.log(session);
  //if the NexthAuth token is not coming
  if (!session) {
    const { pathname, origin } = req.nextUrl.clone();
    return NextResponse.redirect(`${origin}/auth/login?p=${pathname}`);
  }

  const validRoles = ["admin", "super-user", "SEO"];
  if (!validRoles.includes(session.user.role)) {
    const { origin } = req.nextUrl.clone();
    return NextResponse.redirect(`${origin}`);
  }

  return NextResponse.next();
}

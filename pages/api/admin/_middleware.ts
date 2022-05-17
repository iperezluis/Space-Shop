import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
// import { jwt } from "../../utils";

export async function middleware(req: NextRequest | any, ev: NextFetchEvent) {
  const session: any = await getToken({ req });
  // console.log(session);
  // if (!session) {
  //   return new Response(JSON.stringify({ message: "No authorized" }), {
  //     status: 401,
  //     headers: {
  //       "content-type": "application/json",
  //     },
  //   });
  // }

  // const validRoles = ["admin", "super-user", "SEO"];
  // if (!validRoles.includes(session.user.role)) {
  //   return new Response(JSON.stringify({ message: "No authorized" }), {
  //     status: 401,
  //     headers: {
  //       "content-type": "application/json",
  //     },
  //   });
  // }

  return NextResponse.next();
}

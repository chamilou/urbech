// export async function POST() {
//   // Clear cookies/server session if any
//   return new Response(JSON.stringify({ message: "Logged out" }), {
//     status: 200,
//   });
// }
// /api/logout/route.js
import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ message: "Logged out" });

  res.cookies.set("token", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });

  return res;
}

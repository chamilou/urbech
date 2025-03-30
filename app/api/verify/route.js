// /api/verify/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(request) {
  const { email, code } = await request.json();

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || user.verificationCode !== code) {
    return NextResponse.json({ error: "Invalid code" }, { status: 400 });
  }

  await prisma.user.update({
    where: { email },
    data: {
      isVerified: true,
      verificationCode: null, // clear the code
    },
  });

  return NextResponse.json({ message: "Email verified successfully!" });
}

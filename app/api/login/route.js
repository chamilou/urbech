// This route handles user login and authentication.
import { comparePassword, generateToken } from "@/lib/auth";
import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { email, password } = await request.json();

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    //Auto-create customer if not ADMIN
    if (user.role !== "ADMIN") {
      const existingCustomer = await prisma.customer.findFirst({
        where: { userId: user.id },
      });

      if (!existingCustomer) {
        await prisma.customer.create({
          data: {
            name: user.name,
            email: user.email,
            userId: user.id,
          },
        });
      }
    }

    const token = generateToken(user);

    const response = NextResponse.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch (error) {
    console.error("Error during login:", error);
    return NextResponse.json(
      { error: "An error occurred during login" },
      { status: 500 }
    );
  }
}

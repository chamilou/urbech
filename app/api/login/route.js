import { comparePassword, generateToken } from "@/lib/auth";
import prisma from "@/lib/db";
import jwt from "jsonwebtoken"; // You need this import
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

    const token = generateToken(user);

    // Optional: verify immediately
    try {
      jwt.verify(token, process.env.SECRET_KEY); // Make sure SECRET_KEY is same as generateToken
      console.log("Token is valid immediately after creation");
    } catch (err) {
      console.error("Token verification failed:", err);
    }

    const response = NextResponse.json({
      message: "Login successful",
      token, // ✅ return token to frontend
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
      maxAge: 60 * 60 * 24, // 1 day
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

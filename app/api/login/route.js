import prisma from "@/lib/db";
import { comparePassword, generateToken } from "@/lib/auth";

export async function POST(request) {
  const { email, password } = await request.json();

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await comparePassword(password, user.password))) {
    return Response.json({ message: "Invalid credentials" }, { status: 401 });
  }

  const token = generateToken(user);

  return Response.json({ message: "Login successful", token });
}
// app / api / login / route.js;

// import prisma from "@/lib/db";
// import {
//   comparePassword,
//   generateAccessToken,
//   generateRefreshToken,
// } from "@/lib/auth";

// export async function POST(request) {
//   const { email, password } = await request.json();

//   try {
//     // 1. Find user
//     const user = await prisma.user.findUnique({
//       where: { email },
//       select: { id: true, name: true, email: true, password: true, role: true },
//     });

//     if (!user) {
//       return Response.json({ message: "Invalid credentials" }, { status: 401 });
//     }

//     // 2. Verify password
//     const isValid = await comparePassword(password, user.password);
//     if (!isValid) {
//       return Response.json({ message: "Invalid credentials" }, { status: 401 });
//     }

//     // 3. Generate tokens
//     const accessToken = generateAccessToken(user);
//     const refreshToken = generateRefreshToken(user);

//     // 4. Store refresh token (optional but recommended)
//     await prisma.user.update({
//       where: { id: user.id },
//       data: { refreshToken },
//     });

//     // 5. Return response (omit sensitive data)
//     return Response.json({
//       success: true,
//       accessToken,
//       refreshToken,
//       user: {
//         id: user.id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//       },
//     });
//   } catch (error) {
//     console.error("Login error:", error);
//     return Response.json(
//       { message: error.message || "Authentication failed" },
//       { status: 500 }
//     );
//   }
// }

// app/api/login/route.js
// import { NextResponse } from "next/server";
// import prisma from "@/lib/db";
// import { comparePassword, generateAccessToken } from "@/lib/auth";

// export async function POST(request) {
//   try {
//     const { email, password } = await request.json();

//     // 1. Find user (excluding password from the returned user object)
//     const user = await prisma.user.findUnique({
//       where: { email },
//       select: {
//         id: true,
//         name: true,
//         email: true,
//         password: true,
//         role: true,
//       },
//     });

//     if (!user) {
//       return NextResponse.json(
//         { success: false, message: "User not found" },
//         { status: 401 }
//       );
//     }

//     // 2. Verify password
//     const passwordValid = await comparePassword(password, user.password);
//     if (!passwordValid) {
//       return NextResponse.json(
//         { success: false, message: "Invalid credentials" },
//         { status: 401 }
//       );
//     }

//     // 3. Generate token (excluding sensitive data)
//     const token = generateAccessToken({
//       id: user.id,
//       name: user.name,
//       email: user.email,
//       role: user.role,
//     });

//     // 4. Create response with cookie
//     const response = NextResponse.json({
//       success: true,
//       user: {
//         id: user.id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//       },
//     });

//     // 5. Set HTTP-only cookie
//     response.cookies.set({
//       name: "token",
//       value: token,
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "strict",
//       maxAge: 60 * 60 * 24 * 7, // 1 week
//       path: "/",
//     });

//     return response;
//   } catch (error) {
//     console.error("Login error:", error);
//     return NextResponse.json(
//       { success: false, message: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

// app/api/login/route.js
// import { NextResponse } from "next/server";
// import prisma from "@/lib/db";
// import { comparePassword, generateAccessToken } from "@/lib/auth";

// export async function POST(request) {
//   try {
//     const { email, password } = await request.json();

//     const user = await prisma.user.findUnique({
//       where: { email },
//       select: {
//         id: true,
//         name: true,
//         email: true,
//         password: true,
//         role: true,
//       },
//     });

//     if (!user) {
//       return NextResponse.json(
//         { success: false, message: "Invalid credentials" },
//         { status: 401 }
//       );
//     }

//     const passwordValid = await comparePassword(password, user.password);
//     if (!passwordValid) {
//       return NextResponse.json(
//         { success: false, message: "Invalid credentials" },
//         { status: 401 }
//       );
//     }

//     const token = generateAccessToken({
//       id: user.id,
//       name: user.name,
//       email: user.email,
//       role: user.role,
//     });

//     const response = NextResponse.json({
//       success: true,
//       user: {
//         id: user.id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//       },
//     });

//     response.cookies.set("token", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       maxAge: 60 * 60 * 24 * 7, // 1 week
//       path: "/",
//       sameSite: "strict",
//     });

//     return response;
//   } catch (error) {
//     console.error("Login error:", error);
//     return NextResponse.json(
//       { success: false, message: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

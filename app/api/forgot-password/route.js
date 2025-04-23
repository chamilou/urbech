import prisma from "@/lib/db";
import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import crypto from "crypto";


export async function POST(request) {
  const { email } = await request.json();

  try {
    // 1. Validate email exists
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { error: "No user found with this email" },
        { status: 404 }
      );
    }

    // 2. Generate secure token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour expiration

    // 3. Setup email transporter (consistent with register route)
    const transporter = nodemailer.createTransport({
      host: "mail.infomaniak.com",
      port: 465,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Note: Changed from PASSWORD to PASS to match register
      },
    });

    // 4. Delete any existing tokens
    await prisma.passwordResetToken.deleteMany({
      where: { userId: user.id },
    });

    // 5. Create new reset token
    await prisma.passwordResetToken.create({
      data: {
        token: resetToken,
        expiresAt: resetTokenExpiry,
        userId: user.id,
      },
    });

    // 6. Create reset link
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;

    // 7. Send email (consistent styling with register)
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: "Password Reset Request",
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2 style="color: #e88616;">Password Reset</h2>
          <p>Click the link below to reset your password:</p>
          <a href="${resetUrl}" style="color: #e88616;">Reset Password</a>
          <p>This link expires in 1 hour.</p>
        </div>
      `,
    });

    return NextResponse.json(
      { message: "Password reset link sent to your email" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Failed to process password reset request" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
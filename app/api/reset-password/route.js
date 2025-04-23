// app/api/reset-password/route.js
import prisma from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { token, password } = await request.json();

  try {
    // 1. Find valid token
    const resetToken = await prisma.passwordResetToken.findFirst({
      where: {
        token,
        expiresAt: { gt: new Date() }, // Not expired
      },
      include: { user: true },
    });

    if (!resetToken) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    // 2. Hash new password
    const hashedPassword = await hashPassword(password);

    // 3. Update user password
    await prisma.user.update({
      where: { id: resetToken.userId },
      data: { password: hashedPassword },
    });

    // 4. Delete all reset tokens for this user
    await prisma.passwordResetToken.deleteMany({
      where: { userId: resetToken.userId },
    });

    // 5. (Optional) Invalidate all existing sessions
    // This would depend on your session implementation
    // For example, if using JWT, you might want to:
    // - Add passwordChangedAt field to User model
    // - Check this when validating tokens

    return NextResponse.json(
      { message: "Password updated successfully" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      { error: "Failed to reset password" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
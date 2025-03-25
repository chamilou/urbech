// app/api/refresh/route.js
import prisma from "@/lib/db";
import { verifyRefreshToken, generateAccessToken } from "@/lib/auth";

export async function POST(request) {
  const { refreshToken } = await request.json();

  try {
    // 1. Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);

    // 2. Check if token exists in DB
    const user = await prisma.user.findUnique({
      where: { id: decoded.id, refreshToken },
    });

    if (!user) {
      return Response.json(
        { message: "Invalid refresh token" },
        { status: 401 }
      );
    }

    // 3. Generate new access token
    const newAccessToken = generateAccessToken(user);

    return Response.json({
      success: true,
      accessToken: newAccessToken,
    });
  } catch (error) {
    return Response.json(
      { message: error.message || "Token refresh failed" },
      { status: 401 }
    );
  }
}

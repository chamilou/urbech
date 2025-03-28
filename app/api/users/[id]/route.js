import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(_, { params }) {
  const { userId } = params;

  try {
    await prisma.user.delete({
      where: { userId },
    });

    return NextResponse.json({ message: "User deleted" });
  } catch (error) {
    console.error("Failed to delete user:", error);

    return NextResponse.json(
      { message: "Error deleting user" },

      { status: 500 }
    );
  }
}

import { getServerSession } from "next-auth";
import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request, { params }) {
  const session = await getServerSession();
  const { productId } = await request.json();

  if (!session || session.user.id !== params.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      select: {
        wishlistItems: {
          where: { id: productId },
          select: { id: true }
        }
      }
    });

    const isWishlisted = user.wishlistItems.length > 0;
    return NextResponse.json({ isWishlisted });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to check wishlist status" },
      { status: 500 }
    );
  }
}
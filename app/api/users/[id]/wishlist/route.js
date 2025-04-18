import { getServerSession } from "next-auth";
import prisma from "@/lib/db";
import { NextResponse } from "next/server";

// GET - Get user's wishlist
export async function GET(request, { params }) {
  const session = await getServerSession();
  
  // Verify the requested user matches the logged-in user
  if (!session || session.user.id !== params.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      include: {
        wishlistItems: {
          select: {
            id: true,
            name: true,
            price: true,
            mainImage: true,
            articleNumber: true
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user.wishlistItems);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch wishlist" },
      { status: 500 }
    );
  }
}

// POST - Add item to wishlist
export async function POST(request, { params }) {
  const session = await getServerSession();
  const { productId } = await request.json();

  // Verify the requested user matches the logged-in user
  if (!session || session.user.id !== params.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Add to wishlist
    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: {
        wishlistItems: {
          connect: { id: productId }
        }
      },
      include: {
        wishlistItems: {
          select: {
            id: true,
            name: true,
            price: true,
            mainImage: true
          }
        }
      }
    });

    return NextResponse.json(updatedUser.wishlistItems);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to add to wishlist" },
      { status: 500 }
    );
  }
}

// DELETE - Remove item from wishlist
export async function DELETE(request, { params }) {
  const session = await getServerSession();
  const { productId } = await request.json();

  // Verify the requested user matches the logged-in user
  if (!session || session.user.id !== params.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: {
        wishlistItems: {
          disconnect: { id: productId }
        }
      },
      include: {
        wishlistItems: {
          select: {
            id: true,
            name: true,
            price: true,
            mainImage: true
          }
        }
      }
    });

    return NextResponse.json(updatedUser.wishlistItems);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to remove from wishlist" },
      { status: 500 }
    );
  }
}
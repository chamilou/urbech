// app/api/checkout/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/db"; // If you're using Prisma

export async function POST(request) {
  const { cart, userId, address, total } = await request.json();

  if (!cart || !userId || !address) {
    return NextResponse.json(
      { error: "Missing required data" },
      { status: 400 }
    );
  }

  try {
    const order = await prisma.order.create({
      data: {
        userId,
        address,
        total,
        items: {
          create: cart.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    });

    return NextResponse.json({ message: "Order placed", order });
  } catch (err) {
    console.error("Checkout error:", err);
    console.log("Received checkout data:", { cart, userId, address, total });

    return NextResponse.json(
      { error: "Failed to process order" },
      { status: 500 }
    );
  }
}

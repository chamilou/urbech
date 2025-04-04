// This route handles the checkout process for an e-commerce application.
// It validates the incoming request, updates product stock, generates an order number,
// and creates an order in the database. If successful, it returns the order details.

import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(request) {
  const { cart, userId, customerId, total, addressId, partnerId, paymentMode } =
    await request.json();
  console.log("cart", cart);

  if (!cart || !userId || !customerId || !total) {
    return NextResponse.json(
      { error: "Missing required data" },
      { status: 400 }
    );
  }
  try {
    const transactionQueries = [];

    // Validate and update stock for each item
    for (const item of cart) {
      const product = await prisma.product.findUnique({
        where: { id: item.id },
      });

      if (!product) {
        throw new Error(`Product not found: ${item.id}`);
      }

      const newStock = product.stock - item.quantity;
      if (newStock < 0) {
        throw new Error(`Not enough stock for "${product.name}"`);
      }

      transactionQueries.push(
        prisma.product.update({
          where: { id: item.id },
          data: {
            stock: newStock,
            isLowStock: newStock < product.minStock,
          },
        })
      );
    }

    // Generate order number like "202500001"
    const currentYear = new Date().getFullYear();
    const count = await prisma.order.count({
      where: {
        createdAt: {
          gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
          lte: new Date(`${currentYear}-12-31T23:59:59.999Z`),
        },
      },
    });

    const orderNumber = `${currentYear}${(count + 1)
      .toString()
      .padStart(5, "0")}`;

    // Create the order
    transactionQueries.push(
      prisma.order.create({
        data: {
          orderNumber,
          total,
          paymentMode: paymentMode || "CARD", // optional
          //User with capital comes from Order model could be changed in future to user
          User: { connect: { id: userId } },
          customer: { connect: { id: customerId } },
          address: addressId ? { connect: { id: addressId } } : undefined,
          partner: partnerId ? { connect: { id: partnerId } } : undefined,
          items: {
            create: cart.map((item) => ({
              product: { connect: { id: item.id } },
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
      })
    );

    const results = await prisma.$transaction(transactionQueries);

    return NextResponse.json({
      message: "Order placed successfully",
      order: results.at(-1),
    });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to process order" },
      { status: 500 }
    );
  }
}

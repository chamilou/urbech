// // app/api/checkout/route.js
// import { NextResponse } from "next/server";
// import prisma from "@/lib/db"; // If you're using Prisma

// export async function POST(request) {
//   const { cart, userId, address, total } = await request.json();

//   if (!cart || !userId || !address) {
//     return NextResponse.json(
//       { error: "Missing required data" },
//       { status: 400 }
//     );
//   }

//   try {
//     const order = await prisma.order.create({
//       data: {
//         userId,
//         address,
//         total,
//         items: {
//           create: cart.map((item) => ({
//             productId: item.id,
//             quantity: item.quantity,
//             price: item.price,
//           })),
//         },
//       },
//     });

//     return NextResponse.json({ message: "Order placed", order });
//   } catch (err) {
//     console.error("Checkout error:", err);
//     console.log("Received checkout data:", { cart, userId, address, total });

//     return NextResponse.json(
//       { error: "Failed to process order" },
//       { status: 500 }
//     );
//   }
// }
// import { NextResponse } from "next/server";
// import prisma from "@/lib/db";

// export async function POST(request) {
//   const { cart, userId, address, total } = await request.json();

//   if (!cart || !userId || !address) {
//     return NextResponse.json(
//       { error: "Missing required data" },
//       { status: 400 }
//     );
//   }

//   try {
//     const stockUpdates = cart.map(async (item) => {
//       const product = await prisma.product.findUnique({
//         where: { id: item.id },
//       });

//       if (!product) throw new Error(`Product not found: ${item.id}`);

//       const newStock = product.stock - item.quantity;

//       if (newStock < 0) {
//         throw new Error(
//           `Not enough stock for "${product.name}". Only ${product.stock} left.`
//         );
//       }

//       return prisma.product.update({
//         where: { id: item.id },
//         data: {
//           stock: newStock,
//           isLowStock: newStock < product.minStock,
//         },
//       });
//     });

//     const order = await prisma.$transaction([
//       ...stockUpdates,
//       prisma.order.create({
//         data: {
//           userId,
//           address,
//           total,
//           items: {
//             create: cart.map((item) => ({
//               productId: item.id,
//               quantity: item.quantity,
//               price: item.price,
//             })),
//           },
//         },
//       }),
//     ]);

//     return NextResponse.json({ message: "Order placed", order });
//   } catch (err) {
//     console.error("Checkout error:", err);
//     console.log("Received checkout data:", { cart, userId, address, total });

//     return NextResponse.json(
//       { error: err.message || "Failed to process order" },
//       { status: 500 }
//     );
//   }
// }
import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(request) {
  const { cart, userId, address, total } = await request.json();

  if (!cart || !userId || !address) {
    return NextResponse.json(
      { error: "Missing required data" },
      { status: 400 }
    );
  }

  try {
    const transactionQueries = [];

    for (const item of cart) {
      const product = await prisma.product.findUnique({
        where: { id: item.id },
      });

      if (!product) {
        throw new Error(`Product not found: ${item.id}`);
      }

      const newStock = product.stock - item.quantity;

      if (newStock < 0) {
        throw new Error(
          `Not enough stock for "${product.name}". Please contact admin@urbech.com`
        );
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

    // Add order creation to transaction
    transactionQueries.push(
      prisma.order.create({
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
      })
    );

    const results = await prisma.$transaction(transactionQueries);

    return NextResponse.json({
      message: "Order placed",
      order: results.at(-1), // last item is the created order
    });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to process order" },
      { status: 500 }
    );
  }
}

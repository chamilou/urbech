// import prisma from "@/lib/db"; // adjust the path to your Prisma client
// import { NextResponse } from "next/server";
// export async function DELETE(request, { params }) {
//   const { id } = params;

//   try {
//     // Try deleting the product
//     await prisma.product.delete({
//       where: { id },
//     });

//     return new Response(JSON.stringify({ message: "Product deleted" }), {
//       status: 200,
//     });
//   } catch (error) {
//     console.error("Failed to delete product:", error);

//     return new Response(JSON.stringify({ message: "Error deleting product" }), {
//       status: 500,
//     });
//   }
// }
// export async function PUT(request, { params }) {
//   const { id } = params;
//   const data = await request.json();
//   await prisma.product.update({
//     where: { id },
//     data: {
//       // Include the fields to update here
//       name: data.name,
//       price: data.price,
//       description: data.description,
//     },
//   });

//   // Simulate DB update (replace with your database logic)
//   console.log(`Updating product ${id} with:`, data);

//   return NextResponse.json({ message: "Product updated" }, { status: 200 });
// }

import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
  const { id } = params;

  try {
    const data = await request.json();

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        // Include the fields to update here
        name: data.name,
        price: data.price,
        description: data.description,
        // include other fields as needed
      },
    });

    return NextResponse.json(
      { message: "Product updated", product: updatedProduct },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to update product:", error);
    return NextResponse.json(
      { message: "Error updating product", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const { id } = params;

  try {
    await prisma.product.delete({
      where: { id },
    });

    return new Response(JSON.stringify({ message: "Product deleted" }), {
      status: 200,
    });
  } catch (error) {
    console.error("Failed to delete product:", error);

    return new Response(JSON.stringify({ message: "Error deleting product" }), {
      status: 500,
    });
  }
}
export async function GET(request, { params }) {
  const { id } = params;

  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true, // Optional: include category info if needed
      },
    });

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { message: "Error fetching product", error: error.message },
      { status: 500 }
    );
  }
}

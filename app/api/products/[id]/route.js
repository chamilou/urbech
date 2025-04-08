import prisma from "@/lib/db";
import { writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
export async function PUT(request, { params }) {
  const { id } = params; // Removed await since params is not a promise

  try {
    const formData = await request.formData();

    // Get all fields from form data
    const data = {
      name: formData.get("name"),
      price: parseFloat(formData.get("price")),
      description: formData.get("description"),
      stock: parseInt(formData.get("stock")),
      minStock: parseInt(formData.get("minStock")),
      categoryId: formData.get("categoryId"),
      // Add other fields as needed
    };

    // Handle main image upload if provided
    const mainImage = formData.get("mainImage");
    let imagePath = null;

    // Only process image if it was actually uploaded (not empty)
    if (mainImage && mainImage.size > 0 && mainImage.name !== "undefined") {
      const bytes = await mainImage.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${Date.now()}-${mainImage.name.replace(/\s+/g, "-")}`; // Replace spaces with dashes
      const filePath = path.join(
        process.cwd(),
        "public",
        "product-images",
        filename
      );
      await writeFile(filePath, buffer);
      imagePath = `/product-images/${filename}`;
      data.mainImage = imagePath;
    }

    // Update the product
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: data,
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
// export async function PUT(request, { params }) {
//   const { id } = await params;

//   try {
//     const formData = await request.formData();

//     // Get fields from form data
//     const name = formData.get("name");
//     const price = parseFloat(formData.get("price"));
//     const description = formData.get("description");
//     const stock = parseInt(formData.get("stock"));
//     const minStock = parseInt(formData.get("minStock"));
//     const categoryId = formData.get("categoryId");

//     const mainImage = formData.get("mainImage");

//     let imagePath;

//     if (mainImage && typeof mainImage === "object" && mainImage.size > 0) {
//       const bytes = await mainImage.arrayBuffer();
//       const buffer = Buffer.from(bytes);
//       const filename = `${Date.now()}-${mainImage.name}`;
//       const filePath = path.join(
//         process.cwd(),
//         "public",
//         "product-images",
//         filename
//       );
//       await writeFile(filePath, buffer);
//       imagePath = `/product-images/${filename}`;
//     }

//     const updatedProduct = await prisma.product.update({
//       where: { id },
//       data: {
//         name,
//         price,
//         description,
//         stock,
//         minStock,
//         categoryId,
//         ...(imagePath && { mainImage: imagePath }), // only update image if one was uploaded
//       },
//     });
//     console.log("✅ Updated product image path:", updatedProduct.mainImage);

//     return NextResponse.json(
//       { message: "Product updated", product: updatedProduct },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Failed to update product:", error);
//     return NextResponse.json(
//       { message: "Error updating product", error: error.message },
//       { status: 500 }
//     );
//   }
// }

export async function DELETE(request, { params }) {
  const { id } = await params;

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
  const { id } = await params;

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

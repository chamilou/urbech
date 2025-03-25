import prisma from "@/lib/db"; // adjust the path to your Prisma client

export async function DELETE(request, { params }) {
  const { id } = params;

  try {
    // Try deleting the product
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

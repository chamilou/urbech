import prisma from "@/lib/db";

export async function getProductById(id) {
  if (!id) return null;

  try {
    const product = await prisma.product.findUnique({
      where: { id: String(id) },
      include: { category: true }, // include anything else you need
    });
    return product;
  } catch (err) {
    console.error("Failed to fetch product:", err);
    return null;
  }
}
// import prisma from "@/lib/db";

// export async function getProductById(id) {
//   return await prisma.product.findUnique({
//     where: { id },
//     include: { category: true },
//   });
// }

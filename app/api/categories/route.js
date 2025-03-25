import prisma from "@/lib/db";

export async function GET() {
  try {
    const categories = await prisma.category.findMany();
    return new Response(JSON.stringify(categories), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return new Response(
      JSON.stringify({ message: "Failed to fetch categories" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function POST(req) {
  try {
    const { name, parentId } = await req.json();
    const category = await prisma.category.create({
      data: {
        name,
        parentId: parentId || null,
      },
    });
    return new Response(JSON.stringify(category), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating category:", error);
    return new Response(
      JSON.stringify({ message: "Failed to create category" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

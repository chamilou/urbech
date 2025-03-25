import prisma from "@/lib/db";
import { verifyToken } from "@/lib/auth";

export async function POST(request) {
  try {
    // Validate JWT token
    const token = request.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    let decoded;
    try {
      decoded = verifyToken(token);
      if (!decoded || decoded.role !== "ADMIN") {
        return Response.json(
          { message: "Forbidden: Admins only" },
          { status: 403 }
        );
      }
    } catch (error) {
      return Response.json(
        { message: "Invalid or expired token. Please log in again." },
        { status: 401 }
      );
    }

    // Parse request body
    const { name, price, description, categoryId } = await request.json();

    if (!name || !price || !categoryId) {
      return Response.json(
        { message: "Name, price, and categoryId are required" },
        { status: 400 }
      );
    }

    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return Response.json({ message: "Category not found" }, { status: 404 });
    }

    const priceValue = parseFloat(price);
    if (isNaN(priceValue) || priceValue <= 0) {
      return Response.json(
        { message: "Invalid price value. Must be a positive number." },
        { status: 400 }
      );
    }

    //  Create the product in the database
    const product = await prisma.product.create({
      data: {
        name,
        price: priceValue,
        description,
        categoryId,
      },
    });

    return Response.json(
      { message: "Product added successfully", product },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding product:", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}

// Add GET request handler
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const search = searchParams.get("search") || "";
    const categoryId = searchParams.get("categoryId");

    // Fetch products with optional search and category filters
    const products = await prisma.product.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: {
        name: { contains: search, mode: "insensitive" },
        categoryId: categoryId || undefined,
      },
      include: {
        category: true, //  Include category details
      },
    });

    return Response.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req) {
  try {
    const formData = await req.formData();

    const name = formData.get("name");
    const price = parseFloat(formData.get("price"));
    const description = formData.get("description");
    const categoryId = formData.get("categoryId");
    const stock = parseInt(formData.get("stock"));
    const minStock = parseInt(formData.get("minStock"));
    const pricePerUnit = formData.get("pricePerUnit")
      ? parseFloat(formData.get("pricePerUnit"))
      : null;
    const articleNumber = formData.get("articleNumber");
    const weight = formData.get("weight")
      ? parseFloat(formData.get("weight"))
      : null;
    const length = formData.get("length")
      ? parseFloat(formData.get("length"))
      : null;
    const width = formData.get("width")
      ? parseFloat(formData.get("width"))
      : null;
    const height = formData.get("height")
      ? parseFloat(formData.get("height"))
      : null;
    const color = formData.get("color");
    const isTopProduct = formData.get("isTopProduct") === "true";
    const isNewProduct = formData.get("isNewProduct") === "true";

    // Save main image
    const mainImage = formData.get("mainImage");
    let mainImageUrl = "";
    if (mainImage && typeof mainImage === "object" && mainImage.name) {
      const buffer = Buffer.from(await mainImage.arrayBuffer());
      const fileName = `${randomUUID()}_${mainImage.name}`;
      const filePath = path.join(
        process.cwd(),
        "public",
        "product-images",
        fileName
      );
      await writeFile(filePath, buffer);
      mainImageUrl = `/product-images/${fileName}`;
    }

    // Save additional images
    const additionalImages = formData.getAll("additionalImages");
    const savedImages = [];

    for (const image of additionalImages) {
      if (typeof image === "object" && image.name) {
        const buffer = Buffer.from(await image.arrayBuffer());
        const fileName = `${randomUUID()}_${image.name}`;
        const filePath = path.join(
          process.cwd(),
          "public",
          "product-images",
          fileName
        );
        await writeFile(filePath, buffer);
        savedImages.push({
          url: `/product-images/${fileName}`,
          altText: "",
          isPrimary: false,
          order: savedImages.length,
        });
      }
    }

    const product = await prisma.product.create({
      data: {
        name,
        price,
        description,
        categoryId,
        stock,
        minStock,
        pricePerUnit,
        articleNumber,
        weight,
        length,
        width,
        height,
        color,
        isTopProduct,
        isNewProduct,
        mainImage: mainImageUrl,
        images: {
          create: savedImages,
        },
      },
    });

    return NextResponse.json({ message: "Product created", product });
  } catch (err) {
    console.error("Upload failed:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
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
        // name: { contains: search, mode: "insensitive" }, put this back with postgres and remove the next line
        name: { contains: search },
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

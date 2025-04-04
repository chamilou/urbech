import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(request) {
  try {
    const { street, city, zip, state, country, label } = await request.json();

    if (!street || !city || !zip || !country) {
      return NextResponse.json(
        { error: "Missing required fields: street, city, zip, country" },
        { status: 400 }
      );
    }

    const address = await prisma.address.create({
      data: {
        street,
        city,
        zip,
        state: state || null,
        country,
        label: label || "Shipping",
      },
    });

    return NextResponse.json({ id: address.id });
  } catch (error) {
    console.error("Error creating address:", error);
    return NextResponse.json(
      { error: "Failed to create address" },
      { status: 500 }
    );
  }
}

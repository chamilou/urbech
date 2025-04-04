import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(_, context) {
  const { userId } = await context.params;

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  try {
    const customer = await prisma.customer.findFirst({
      where: { userId },
    });

    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ id: customer.id });
  } catch (err) {
    console.error("Error fetching customer:", err);
    return NextResponse.json(
      { error: "Failed to fetch customer" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import jwt from "jsonwebtoken";

export async function POST(request) {
  try {
    // 1. Get the token from the Authorization header
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Verify JWT and extract user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // 3. Parse request body
    const body = await request.json();
    const { name, phone, city, country, address: street, zip: zip } = body;

    if (!name || !city || !country || !street || !zip) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 4. Find customer for this user
    const customer = await prisma.customer.findFirst({
      where: { userId },
      include: {
        address: true,
        user: true, // include user info (e.g. email) if needed
      },
    });

    if (!customer) {
      return NextResponse.json(
        { error: "Customer profile not found" },
        { status: 404 }
      );
    }

    // 5. Create new address (or upsert if you want to avoid duplicates)
    const address = await prisma.address.create({
      data: {
        street,
        city,
        country,
        zip,
      },
    });

    // 6. Update customer with new profile info + addressId
    await prisma.customer.update({
      where: { id: customer.id },
      data: {
        name,
        phone,
        city,
        country,
        addressId: address.id,
      },
    });

    return NextResponse.json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error("Profile update error:", err);
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const customer = await prisma.customer.findFirst({
      where: { userId },
      include: {
        address: true,
        user: true,
        orders: {
          orderBy: { createdAt: "desc" },
          include: {
            items: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });

    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      name: customer.name,
      email: customer.user?.email || "", // from related User
      phone: customer.phone,
      country: customer.country,
      city: customer.city,
      address: customer.address || null,
      orders: customer.orders || [],
    });
  } catch (err) {
    console.error("Profile GET error:", err);
    return NextResponse.json(
      { error: "Failed to load profile" },
      { status: 500 }
    );
  }
}

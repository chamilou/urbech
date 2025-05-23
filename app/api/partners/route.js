import { NextResponse } from "next/server";
import prisma from "@/lib/db";
// GET all partners
// export async function GET() {
//   try {
//     const partners = await prisma.partner.findMany({
//       select:{id:true, name:true},
      
//       orderBy: { createdAt: "desc" },
//     });
//     return NextResponse.json({ partners });
//   } catch (err) {
//     return NextResponse.json(
//       { error: "Failed to fetch partners." },
//       { status: 500 }
//     );
//   }
// }



export async function GET() {
  try {
    const partners = await prisma.partner.findMany({
      select: {
        id: true,
        name: true,
        type: true
      },
      orderBy: { name: 'asc' }
    });
    return NextResponse.json(Array.isArray(partners) ? partners : []);
  } catch (error) {
    console.error("GET /api/partners error:", error);
    return NextResponse.json([], { status: 500 });
  }
}

// POST new partner
export async function POST(req) {
  try {
    const data = await req.json();

    const newPartner = await prisma.partner.create({
      data: {
        name: data.name,
        type: data.type,
        phone: data.phone,
        email: data.email,
        address: {
          create: {
            street: data.street,
            city: data.city,
            country: data.country,
            zip: data.zip,
          },
        },
      },
    });

    return NextResponse.json({ partner: newPartner });
  } catch (err) {
    console.error("Partner create error:", err);
    return NextResponse.json(
      { error: "Failed to create partner." },
      { status: 500 }
    );
  }
}

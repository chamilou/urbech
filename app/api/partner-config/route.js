import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const partner = await prisma.partner.findFirst();
  return NextResponse.json(partner);
}

export async function POST(request) {
  const body = await request.json();

  const partner = await prisma.partner.findFirst();

  if (!partner) {
    return NextResponse.json({ error: "No partner found." }, { status: 404 });
  }

  const updated = await prisma.partner.update({
    where: { id: partner.id },
    data: {
      headerTitle: body.headerTitle,
      footerNote: body.footerNote,
      bankDetails: body.bankDetails,
      contactInfo: body.contactInfo,
    },
  });

  return NextResponse.json(updated);
}

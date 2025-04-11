export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import prisma from "@/lib/db"; // make sure you import this

export async function POST(req) {
  const body = await req.json();
  const {
    cart,
    user,
    address,
    total,
    partnerId,
    adminConfig = {},
    orderId,
  } = body;

  // Fetch partner from the database
  let partnerConfig = null;

  if (partnerId) {
    partnerConfig = await prisma.partner.findUnique({
      where: { id: partnerId },
    });
  }
  console.log("partnerConfig", partnerConfig);
  console.log("partnerId", partnerId);
  const {
    headerTitle = partnerConfig?.headerTitle || "MyShop - Order Summary",
    footerNote = partnerConfig?.footerNote || "Thank you for your purchase!",
    bankDetails = partnerConfig?.bankDetails ||
      "Bank: Default Bank\n IBAN: XX...\n SWIFT:DEFAULT123",
    contactInfo = partnerConfig?.contactInfo ||
      "Contact us at support@myshop.com",
  } = adminConfig; // adminConfig overrides if provided

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4 size
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontSize = 12;

  let y = 800;

  const drawText = (text, options = {}) => {
    const { x = 50, size = fontSize, color = rgb(0, 0, 0) } = options;
    const lines = text.split("\n");
    for (const line of lines) {
      page.drawText(line, { x, y, size, font, color });
      y -= size + 4;
    }
  };

  // === Header ===
  drawText(headerTitle, { size: 18 });
  drawText(`Order Number: #${orderId || "N/A"}`, {
    size: 14,
  });
  y -= 100;

  drawText(`Customer: ${user?.name || "Guest"}`, { size: 14 });
  drawText(`Email: ${user?.email || "N/A"}`, { size: 14 });
  y -= 10;
  drawText(`Date: ${new Date().toLocaleDateString()}`, { x: 100, size: 14 });
  y -= 10;
  drawText(`Shipping Address:${address}`, { size: 14 });
  y -= 5;

  // === Order Items ===
  drawText("Items Ordered:", { size: 14 });
  y -= 5;

  cart.forEach((item) => {
    drawText(
      `${item.name} x ${item.quantity} - $${(
        item.price * item.quantity
      ).toFixed(2)}`
    );
  });

  y -= 10;
  drawText(`Total: $${total.toFixed(2)}`, { size: 14 });
  y -= 20;

  // === Footer ===
  drawText(footerNote, { size: 10 });
  y -= 200;
  drawText(bankDetails, { x: 300, size: 10 });
  y -= 50;
  drawText(contactInfo, { x: 300, size: 10 });

  const pdfBytes = await pdfDoc.save();

  // Send the PDF as an email attachment

  return new NextResponse(pdfBytes, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=order-summary-${
        orderId || "Preview"
      }.pdf`,
    },
  });
}

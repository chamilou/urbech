export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export async function POST(req) {
  const body = await req.json();
  const { cart, user, address, total, adminConfig = {} } = body;

  const {
    headerTitle = "MyShop - Order Summary",
    footerNote = "Thank you for your purchase!",
    bankDetails = "Bank: ABC Bank\nAccount Number: 123-456-789\nIBAN: XX00 1234 5678 9012 3456 78\nSWIFT: ABCDUSXX",
    contactInfo = "Contact us at support@myshop.com",
  } = adminConfig;

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
  y -= 10;
  drawText(`Customer: ${user?.name}`);
  drawText(`Email: ${user?.email}`);
  drawText(`Shipping Address: ${address}`);
  y -= 10;

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
  drawText(bankDetails, { size: 10 });
  drawText(contactInfo, { size: 10 });

  const pdfBytes = await pdfDoc.save();

  return new NextResponse(pdfBytes, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=order-summary.pdf",
    },
  });
}

// below is working versio

// export const runtime = "nodejs"; // or "edge" also works with pdf-lib

// import { NextResponse } from "next/server";
// import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

// export async function POST(req) {
//   const { cart, user, address, total } = await req.json();

//   const pdfDoc = await PDFDocument.create();
//   const page = pdfDoc.addPage([595, 842]); // A4
//   const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
//   const fontSize = 12;

//   let y = 800;

//   const drawText = (text, options = {}) => {
//     const { x = 50, size = fontSize, color = rgb(0, 0, 0) } = options;
//     page.drawText(text, { x, y, size, font, color });
//     y -= size + 6;
//   };

//   // === HEADER ===
//   drawText("MyShop - Order Summary", { size: 18 });

//   drawText(`Customer: ${user?.name}`);
//   drawText(`Email: ${user?.email}`);
//   drawText(`Shipping Address: ${address}`);

//   y -= 10;
//   drawText("Items Ordered:", { size: 14 });

//   cart.forEach((item) => {
//     drawText(
//       `${item.name} x ${item.quantity} - $${(
//         item.price * item.quantity
//       ).toFixed(2)}`
//     );
//   });

//   y -= 10;
//   drawText(`Total: $${total.toFixed(2)}`, { size: 14 });

//   y -= 20;
//   drawText("Thank you for your purchase!", { size: 10 });
//   drawText("Please make payments to:", { size: 10 });
//   drawText("Bank: ABC Bank | Account: 123-456-789", { size: 10 });
//   drawText("IBAN: XX00 1234 5678 9012 3456 78 | SWIFT: ABCDUSXX", { size: 10 });
//   drawText("Contact us at support@myshop.com", { size: 10 });

//   const pdfBytes = await pdfDoc.save();

//   return new NextResponse(pdfBytes, {
//     status: 200,
//     headers: {
//       "Content-Type": "application/pdf",
//       "Content-Disposition": "attachment; filename=order-summary.pdf",
//     },
//   });
// }

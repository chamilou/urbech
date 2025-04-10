import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

/**
 * Generates a PDF buffer representing an order summary.
 * @param {Object} params
 * @param {Array} params.cart - List of cart items
 * @param {Object} params.user - User object (should contain at least `name`, `email`)
 * @param {string} params.address - Full shipping address as a string
 * @param {number} params.total - Total order cost
 * @param {string} params.orderId - Order number (e.g., 202500001)
 * @param {Object} [params.adminConfig] - Optional custom config for PDF content
 * @returns {Promise<Uint8Array>} PDF buffer (to send as attachment or download)
 */
export async function generateOrderPdf({
  cart,
  user,
  address,
  total,
  orderId,
  adminConfig = {},
}) {
  const {
    headerTitle = "MyShop - Order Summary",
    footerNote = "Thank you for your purchase!",
    bankDetails = "Bank: ABC Bank\nAccount Number: 123-456-789\nIBAN: XX00 1234 5678 9012 3456 78\nSWIFT: ABCDUSXX",
    contactInfo = "Contact us at support@myshop.com",
  } = adminConfig;

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4 size in points
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
  drawText(`Order Number: #${orderId || "N/A"}`, { size: 14 });
  y -= 40;

  // === Customer Info ===
  drawText(`Customer: ${user?.name || "Guest"}`, { size: 14 });
  drawText(`Email: ${user?.email || "N/A"}`, { size: 14 });
  drawText(`Date: ${new Date().toLocaleDateString()}`, { size: 14 });
  drawText(`Shipping Address: ${address}`, { size: 14 });
  y -= 20;

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
  y -= 40;

  // === Footer ===
  drawText(footerNote, { size: 10 });
  y -= 150;

  drawText(bankDetails, { x: 300, size: 10 });
  y -= 50;
  drawText(contactInfo, { x: 300, size: 10 });

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}

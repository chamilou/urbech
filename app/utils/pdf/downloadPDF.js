export async function downloadPDF({
  cart,
  user,
  address,
  total,
  adminConfig,
  orderId,
}) {
  try {
    const res = await fetch("/api/checkout/pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cart,
        user,
        address,
        total,
        adminConfig,
        orderId,
      }),
    });

    if (!res.ok) {
      alert("Failed to generate PDF.");
      return;
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `order-${orderId.slice(3, 10) || "preview"}.pdf`;
    link.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("PDF download failed:", error.message);
    alert("Something went wrong generating the PDF.");
  }
}

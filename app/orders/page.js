"use client";

import { useEffect, useState } from "react";
import styles from "./orders.module.css";
import { FileText } from "lucide-react"; // PDF icon from lucide
import { downloadPDF } from "@/app/utils/pdf/downloadPDF";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  const handleGeneratePDF = (order) => {
    if (!order || !Array.isArray(order.items)) {
      console.warn("Invalid order or missing items:", order);
      alert("This order does not have item data available.");
      return;
    }

    downloadPDF({
      cart: order.items.map((item) => ({
        name: item.product?.name || "Unknown Product",
        price: item.price,
        quantity: item.quantity,
      })),
      user: order.User || { name: "Customer", email: "unknown@example.com" },
      address: order.address || "Not provided",
      total: order.total || 0,
      orderId: order.orderNumber,
      adminConfig: {
        headerTitle: "MyShop Invoice",
        footerNote: "Thanks for your order!",
        bankDetails: "Bank: ABC\nIBAN: XX\nSWIFT: ABC123",
        contactInfo: "support@myshop.com",
      },
    });
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch orders");
        setOrders(data.orders);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Your Orders</h1>
      {error && <p className={styles.error}>{error}</p>}
      {orders.length === 0 ? (
        <p>You have no orders yet.</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Order #</th>
              <th>Customer</th>
              <th>City</th>
              <th>Date</th>
              <th>Total</th>
              <th>Items</th>
              <th>Status</th>
              <th>PDF</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.orderNumber}</td>
                <td>{order.customer?.name || "Unknown Customer"}</td>
                <td>{order.city}</td>
                <td>{new Date(order.createdAt).toLocaleString()}</td>
                <td>${order.total.toFixed(2)}</td>
                <td>
                  <ul className={styles.itemsList}>
                    {order.items.map((item) => (
                      <li key={item.id}>
                        {item.quantity} × {item.product?.name || "Product"} — $
                        {(item.price * item.quantity).toFixed(2)}
                      </li>
                    ))}
                  </ul>
                </td>
                <td>{order.status}</td>
                <td>
                  <button
                    className={styles.pdfButton}
                    onClick={() => handleGeneratePDF(order)}
                    title="Download PDF"
                  >
                    <FileText size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// app/orders/page.js
"use client";
import { useEffect, useState } from "react";
import styles from "./orders.module.css";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

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
      <h1>Your Orders</h1>
      {error && <p className={styles.error}>{error}</p>}
      {orders.length === 0 ? (
        <p>You have no orders yet.</p>
      ) : (
        <ul className={styles.orderList}>
          {orders.map((order) => (
            <li key={order.id} className={styles.order}>
              <h2>Order #{order.id.slice(0, 8)}</h2>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(order.createdAt).toLocaleString()}
              </p>
              <p>
                <strong>Total:</strong> ${order.total.toFixed(2)}
              </p>

              <h3>Items:</h3>
              <ul>
                {order.items.map((item) => (
                  <li key={item.id}>
                    {item.quantity} × {item.product?.name || "Product"} — $
                    {(item.price * item.quantity).toFixed(2)}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

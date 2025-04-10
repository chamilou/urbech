"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useCart } from "@/app/context/CartContext";
import styles from "./checkout.module.css";
import { useUser } from "@/app/context/UserContext";
import { downloadPDF } from "@/app/utils/pdf/downloadPDF";

export default function CheckoutPage() {
  const { cart, totalCost, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState("visa");
  const { user } = useUser();
  const router = useRouter();
  const formattedTotalCost = totalCost ? totalCost.toFixed(2) : "0.00";
  const [pdfLoading, setPdfLoading] = useState(false);
  const [useDifferentInvoice, setUseDifferentInvoice] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    zip: "",
    invoiceAddress: "",
    invoiceCity: "",
    invoiceZip: "",
  });

  const [adminConfig, setAdminConfig] = useState({
    headerTitle: "SuperStore Invoice",
    footerNote: "We appreciate your business!",
    bankDetails: "Bank: XYZ\nIBAN: 123456789\nSWIFT: XYZBANK123",
    contactInfo: "Contact us at support@superstore.com",
  });

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user]);

  useEffect(() => {
    const loadSavedAddress = async () => {
      if (!user) return;

      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (res.ok && data.address) {
          setFormData((prev) => ({
            ...prev,
            firstName: data.name?.split(" ")[0] || "",
            lastName: data.name?.split(" ").slice(1).join(" ") || "",
            address: data.address.street || "",
            city: data.address.city || "",
            zip: data.address.zip || "",
          }));
        }
      } catch (err) {
        console.error("Failed to load saved address:", err);
      }
    };

    loadSavedAddress();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("You must be logged in to place an order.");
      return;
    }

    try {
      const addressRes = await fetch("/api/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          street: formData.address,
          city: formData.city,
          zip: formData.zip,
          country: "USA",
        }),
      });

      const addressData = await addressRes.json();
      if (!addressRes.ok)
        throw new Error(addressData.error || "Failed to save address");

      const addressId = addressData.id;

      const customerRes = await fetch(`/api/customers/by-user/${user.id}`);
      const customerData = await customerRes.json();
      if (!customerRes.ok)
        throw new Error(customerData.error || "Customer not found");

      const customerId = customerData.id;

      const orderRes = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cart,
          user,
          userEmail: user.email,
          userId: user.id,
          customerId: customerId,
          addressId,
          total: totalCost,
          paymentMode: paymentMethod,
          partnerId,
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.error || "Order failed");

      clearCart();
      setFormData({
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        zip: "",
        invoiceAddress: "",
        invoiceCity: "",
        invoiceZip: "",
      });
      router.push("/order-success");
    } catch (err) {
      console.error("Checkout failed:", err);
      alert("Checkout failed. Please try again.");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Checkout</h1>
      <div className={styles.checkoutGrid}>
        {/* Order Summary */}
        <div className={styles.cartSummary}>
          <h2>Order Summary</h2>
          <p>
            <strong>Customer:</strong> {formData.firstName} {formData.lastName}
          </p>
          <p>
            <strong>Shipping:</strong> {formData.address}, {formData.city},{" "}
            {formData.zip}
          </p>
          <p>
            <strong>Date:</strong> {new Date().toLocaleDateString()}
          </p>

          {cart.map((item) => (
            <div key={item.id} className={styles.cartItem}>
              <h3>{item.name}</h3>
              <p>Quantity: {item.quantity}</p>
              <p>Price: ${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
          <div className={styles.totalCost}>
            <h3>Total: ${formattedTotalCost}</h3>
          </div>
          {/* <button onClick={handlePDF} disabled={pdfLoading}>
            {pdfLoading ? "Generating..." : "Download PDF"}
          </button> */}
        </div>

        {/* Checkout Form */}
        <form onSubmit={handleSubmit} className={styles.checkoutForm}>
          <h2>Shipping Details</h2>
          <div className={styles.formGroup}>
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              required
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              // required
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="address">Shipping Address</label>
            <input
              type="text"
              id="address"
              name="address"
              required
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="city">City</label>
            <input
              type="text"
              id="city"
              name="city"
              required
              value={formData.city}
              onChange={(e) =>
                setFormData({ ...formData, city: e.target.value })
              }
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="zip">ZIP Code</label>
            <input
              type="text"
              id="zip"
              name="zip"
              required
              value={formData.zip}
              onChange={(e) =>
                setFormData({ ...formData, zip: e.target.value })
              }
            />
          </div>

          <div className={styles.formGroup}>
            <input
              type="checkbox"
              id="useDifferentInvoice"
              checked={useDifferentInvoice}
              onChange={(e) => setUseDifferentInvoice(e.target.checked)}
            />
            <label htmlFor="useDifferentInvoice">
              Use a different invoice address
            </label>
          </div>

          {useDifferentInvoice && (
            <>
              <div className={styles.formGroup}>
                <label htmlFor="invoiceAddress">Invoice Address</label>
                <input
                  type="text"
                  id="invoiceAddress"
                  value={formData.invoiceAddress}
                  onChange={(e) =>
                    setFormData({ ...formData, invoiceAddress: e.target.value })
                  }
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="invoiceCity">Invoice City</label>
                <input
                  type="text"
                  id="invoiceCity"
                  value={formData.invoiceCity}
                  onChange={(e) =>
                    setFormData({ ...formData, invoiceCity: e.target.value })
                  }
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="invoiceZip">Invoice ZIP</label>
                <input
                  type="text"
                  id="invoiceZip"
                  value={formData.invoiceZip}
                  onChange={(e) =>
                    setFormData({ ...formData, invoiceZip: e.target.value })
                  }
                />
              </div>
            </>
          )}

          <h2>Payment Details</h2>
          <div className={styles.formGroup}>
            <label htmlFor="paymentMethod">Payment Method</label>
            <select
              id="paymentMethod"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              required
            >
              <option value="visa">Visa</option>
              <option value="mastercard">MasterCard</option>
              <option value="paypal">PayPal</option>
              <option value="bill">Bill</option>
              <option value="other">Other</option>
            </select>
          </div>

          {(paymentMethod === "visa" || paymentMethod === "mastercard") && (
            <>
              <div className={styles.formGroup}>
                <label htmlFor="cardNumber">Card Number</label>
                <input type="text" id="cardNumber" required />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="expiry">Expiry Date</label>
                <input type="text" id="expiry" placeholder="MM/YY" required />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="cvv">CVV</label>
                <input type="text" id="cvv" required />
              </div>
            </>
          )}

          {paymentMethod === "paypal" && (
            <div className={styles.formGroup}>
              <label htmlFor="paypalEmail">PayPal Email</label>
              <input type="email" id="paypalEmail" required />
            </div>
          )}

          {paymentMethod === "bill" && (
            <div className={styles.formGroup}>
              <label htmlFor="invoiceDetails">Invoice Address</label>
              <input type="text" id="invoiceDetails" required />
            </div>
          )}

          {paymentMethod === "other" && (
            <div className={styles.formGroup}>
              <label htmlFor="otherDetails">Payment Details</label>
              <textarea id="otherDetails" required />
            </div>
          )}

          <button type="submit" className={styles.submitButton}>
            Place Order
          </button>
        </form>
      </div>
    </div>
  );
}

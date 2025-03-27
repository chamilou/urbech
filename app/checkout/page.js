"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import styles from "./checkout.module.css";

export default function CheckoutPage() {
  const { cart, totalCost } = useCart();
  const [paymentMethod, setPaymentMethod] = useState("visa"); // Default payment method

  const formattedTotalCost = totalCost ? totalCost.toFixed(2) : "0.00";

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Order placed successfully using ${paymentMethod}!`);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Checkout</h1>
      <div className={styles.checkoutGrid}>
        {/* Cart Summary */}
        <div className={styles.cartSummary}>
          <h2>Order Summary</h2>
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
        </div>

        {/* Checkout Form */}
        <form onSubmit={handleSubmit} className={styles.checkoutForm}>
          <h2>Shipping Details</h2>
          <div className={styles.formGroup}>
            <label htmlFor="name">Full Name</label>
            <input type="text" id="name" name="name" required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="address">Shipping Address</label>
            <input type="text" id="address" name="address" required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="city">City</label>
            <input type="text" id="city" name="city" required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="zip">ZIP Code</label>
            <input type="text" id="zip" name="zip" required />
          </div>

          <h2>Payment Details</h2>
          <div className={styles.formGroup}>
            <label htmlFor="paymentMethod">Payment Method</label>
            <select
              id="paymentMethod"
              name="paymentMethod"
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

          {/* Visa/MasterCard Fields */}
          {(paymentMethod === "visa" || paymentMethod === "mastercard") && (
            <>
              <div className={styles.formGroup}>
                <label htmlFor="cardNumber">Card Number</label>
                <input type="text" id="cardNumber" name="cardNumber" required />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="expiry">Expiry Date</label>
                <input
                  type="text"
                  id="expiry"
                  name="expiry"
                  placeholder="MM/YY"
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="cvv">CVV</label>
                <input type="text" id="cvv" name="cvv" required />
              </div>
            </>
          )}

          {/* PayPal Field */}
          {paymentMethod === "paypal" && (
            <div className={styles.formGroup}>
              <label htmlFor="paypalEmail">PayPal Email</label>
              <input
                type="email"
                id="paypalEmail"
                name="paypalEmail"
                required
              />
            </div>
          )}

          {/* Bill Field */}
          {paymentMethod === "bill" && (
            <div className={styles.formGroup}>
              <label htmlFor="invoiceAddress">Invoice Address</label>
              <input
                type="text"
                id="invoiceAddress"
                name="invoiceAddress"
                required
              />
            </div>
          )}

          {/* Other Field */}
          {paymentMethod === "other" && (
            <div className={styles.formGroup}>
              <label htmlFor="otherDetails">Payment Details</label>
              <textarea id="otherDetails" name="otherDetails" required />
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

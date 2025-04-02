"use client";

import { useCart } from "@/app/context/CartContext";
import { useUser } from "@/app/context/UserContext"; // Assuming you have user authentication
import Image from "next/image";
import Link from "next/link";
import styles from "./cart.module.css";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, totalCost } = useCart();
  const { user } = useUser();

  const handleQuantityChange = (id, quantity) => {
    if (quantity < 1) {
      removeFromCart(id);
    } else {
      updateQuantity(id, quantity);
    }
  };

  return (
    <div className={styles.container}>
      {user && <h3>Hello, {user.name.split(" ")[0]} 👋</h3>}
      <h1 className={styles.title}>Your Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className={styles.cartItems}>
            {cart.map((item) => (
              <div key={item.id} className={styles.cartItem}>
                <div className={styles.itemImage}>
                  <Image
                    src={item.mainImage}
                    alt={item.name}
                    width={100}
                    height={100}
                    className={styles.image}
                  ></Image>
                </div>
                <div className={styles.itemDetails}>
                  <h2>{item.name}</h2>
                  <p>{item.description}</p>
                  <p>Price: ${item.price.toFixed(2)}</p>
                  <div className={styles.quantityControl}>
                    <button
                      onClick={() =>
                        handleQuantityChange(item.id, item.quantity - 1)
                      }
                      className={styles.quantityButton}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() =>
                        handleQuantityChange(item.id, item.quantity + 1)
                      }
                      className={styles.quantityButton}
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className={styles.removeButton}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.totalCost}>
            <h3>Total Cost: ${totalCost ? totalCost.toFixed(2) : "0.00"}</h3>

            {!user ? (
              <p className={styles.loginMessage}>
                Please <Link href="/login">log in</Link> to proceed to checkout.
              </p>
            ) : (
              // <Link href="/checkout" className={styles.checkoutButton}>
              //   Proceed to Checkout
              // </Link>

              <Link
                href="/checkout"
                className={styles.checkoutButton}
                style={{ pointerEvents: totalCost === 0 ? "none" : "auto" }}
              >
                Proceed to Checkout
              </Link>
            )}
          </div>
        </>
      )}
    </div>
  );
}

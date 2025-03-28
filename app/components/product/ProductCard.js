// app/components/ProductCard.js
"use client";
import styles from "./ProductCard.module.css";
import { useCart } from "@/app/context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className={styles.productCard}>
      <div className={styles.imageWrapper}>
        <div className={styles.badges}>
          {product.isTopProduct && <span className={styles.topBadge}>TOP</span>}
          {product.isNewProduct && <span className={styles.newBadge}>NEW</span>}
        </div>
        <button className={styles.wishlistButton}>&hearts;</button>
        <div className={styles.imagePlaceholder}>
          <span>Image 4:3</span>
        </div>
      </div>

      <div className={styles.productInfo}>
        <h2 className={styles.name}>{product.name}</h2>
        <div className={styles.stars}>★★★★☆</div>
        <p className={styles.price}>${product.price.toFixed(2)}</p>

        {product.pricePerKg && (
          <p className={styles.pricePerKg}>
            (${product.pricePerKg.toFixed(2)} / kg)
          </p>
        )}

        {product.articleNumber && (
          <p className={styles.articleNumber}>
            Art. No: {product.articleNumber}
          </p>
        )}

        <p className={styles.delivery}>Delivery: 1–2 days</p>

        <button
          className={styles.addToCartButton}
          onClick={() => addToCart(product)}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

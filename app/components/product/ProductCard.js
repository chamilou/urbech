// app/components/ProductCard.js
"use client";
import styles from "./ProductCard.module.css";
import { useCart } from "@/app/context/CartContext";
import Link from "next/link";
import Image from "next/image";
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
          <Link key={product.id} href={`/products/${product.id}`}>
            <Image
              src={product.mainImage}
              alt={product.name}
              width={200}
              height={150}
            ></Image>
          </Link>
        </div>
      </div>

      <div className={styles.productInfo}>
        <h2 className={styles.name}>{product.name}</h2>
        <div className={styles.stars}>★★★★☆</div>
        <p className={styles.price}>${product.price.toFixed(2)}</p>

        {product.pricePerUnit && (
          <p className={styles.pricePerKg}>
            (${product.pricePerUnit.toFixed(2)} / kg)
          </p>
        )}

        <p className={styles.articleNumber}>
          Art.N°:
          {product.articleNumber != null ? product.articleNumber : "No Data"}
        </p>

        <p className={styles.articleNumber}>
          Stock: {product.stock != null ? product.stock : "No Data"}
        </p>

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

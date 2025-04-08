"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./ProductDetail.module.css";
import { useCart } from "@/app/context/CartContext";

export default function ProductDetailPage({ productId }) {
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${productId}`);
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error("Failed to load product", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleAddToCart = () => {
    addToCart({ ...product, quantity });
    router.back();
  };

  if (loading) return <div>Loading...</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div className={styles.detailContainer}>
      {/* Your full layout like before */}
      <div className={styles.productHeader}>
        <div className={styles.productImageContainer}>
          <Image
            src={product.mainImage}
            fill
            alt={product.name}
            className={styles.productImage}
            priority
          />
        </div>
        <div className={styles.productInfo}>
          <h1 className={styles.productTitle}>{product.name}</h1>
          {product.category && (
            <span className={styles.category}>{product.category.name}</span>
          )}
          <p className={styles.price}>${product.price.toFixed(2)}</p>
          <p className={styles.description}>
            {product.description.slice(0, 30)}
          </p>

          <div className={styles.actions}>
            <div className={styles.quantitySelector}>
              <button
                className={styles.quantityButton}
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                }
                className={styles.quantityInput}
                min="1"
              />
              <button
                className={styles.quantityButton}
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </button>
            </div>
            <button className={styles.addToCart} onClick={handleAddToCart}>
              В корзину
            </button>
          </div>
        </div>
      </div>

      <div className={styles.additionalInfo}>
        <h2 className={styles.additionalTitle}>{product.description}</h2>
        <table className={styles.specs}>
          <tbody>
            <tr>
              <th>SKU</th>
              <td>{product.articleNumber || "N/A"}</td>
            </tr>
            <tr>
              <th>Weight</th>
              <td>{product.weight || "N/A"}</td>
            </tr>
            <tr>
              <th>Dimensions</th>
              <td>{product.dimensions || "N/A"}</td>
            </tr>
            <tr>
              <th>Availability</th>
              <td>{product.stock > 0 ? "In Stock" : "Out of Stock"}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

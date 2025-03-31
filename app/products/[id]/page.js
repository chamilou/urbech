"use client";
import { useEffect, useState } from "react";
import styles from "./ProductDetail.module.css";
import Image from "next/image";
import { useCart } from "@/app/context/CartContext";
import { useRouter } from "next/navigation";
import { use } from "react";
export default function ProductDetailPage({ params }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const router = useRouter();
  const { id } = use(params);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart({ ...product, quantity }); // Add the product with selected quantity

    router.back(); // Navigate back to previous page
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (!product) return <div className={styles.notFound}>Product not found</div>;

  return (
    <div className={styles.detailContainer}>
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
          <p className={styles.description}>{product.description}</p>

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
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      <div className={styles.additionalInfo}>
        <h2 className={styles.additionalTitle}>Product Details</h2>
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

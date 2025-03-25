"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import styles from "./edit.module.css";
import Link from "next/link";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id;
  const [product, setProduct] = useState({
    name: "",
    price: "",
    description: "",
  });
  const [loading, setLoading] = useState({
    fetch: true,
    submit: false,
  });
  const [error, setError] = useState("");

  // Fetch product data on load
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading((prev) => ({ ...prev, fetch: true }));
        setError("");

        const res = await fetch(`/api/products/${productId}`);
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Failed to fetch product");
        }

        const data = await res.json();
        setProduct({
          name: data.name || "",
          price: data.price || "",
          description: data.description || "",
        });
      } catch (err) {
        setError(err.message);
        console.error("Fetch error:", err);
      } finally {
        setLoading((prev) => ({ ...prev, fetch: false }));
      }
    };

    fetchProduct();
  }, [productId]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading((prev) => ({ ...prev, submit: true }));
    setError("");

    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: product.name,
          price: parseFloat(product.price), // Ensure number format
          description: product.description,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update product");
      }

      router.push("/dashboard/products");
      router.refresh(); // Ensure cache is cleared
    } catch (err) {
      setError(err.message);
      console.error("Submission error:", err);
    } finally {
      setLoading((prev) => ({ ...prev, submit: false }));
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  if (loading.fetch) {
    return <div className="container">Loading product data...</div>;
  }

  if (error && !loading.fetch) {
    return (
      <div className="container">
        <p className="error">{error}</p>
        <Link href="/products">Back to Products</Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Edit Product</h1>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Name</label>
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
            className={styles.input}
            required
            disabled={loading.submit}
          />
        </div>
        <div className={styles.formGroup}>
          <label>Price</label>
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleChange}
            className={styles.input}
            required
            step="0.01"
            min="0"
            disabled={loading.submit}
          />
        </div>
        <div>
          <label>Description</label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            className={styles.textarea}
            required
            disabled={loading.submit}
          />
        </div>
        <button
          type="submit"
          disabled={loading.submit}
          className={styles.button}
        >
          {loading.submit ? "Updating..." : "Update Product"}
        </button>
        {error && <p className="error">{error}</p>}
      </form>
      <Link href="/dashboard/products">Back to Products</Link>
    </div>
  );
}

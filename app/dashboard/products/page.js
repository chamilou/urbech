// src/app/dashboard/products/page.js
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import ProductTable from "@/app/components/ProductTable";
import styles from "./products.module.css";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        setError("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Delete a product
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmed) return;

    try {
      await fetch(`/api/products/${id}`, { method: "DELETE" });
      setProducts(products.filter((product) => product.id !== id));
    } catch (err) {
      setError("Failed to delete product");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Manage Products</h1>
        <Link href="/dashboard/products/add" className={styles.addButton}>
          Add Product
        </Link>
      </div>
      <ProductTable products={products} onDelete={handleDelete} />
    </div>
  );
}

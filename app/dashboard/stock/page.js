"use client";
import { useEffect, useState } from "react";
import styles from "./stock.module.css";

export default function StockPage() {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    if (filter === "low") return product.stock < product.minStock;
    if (filter === "out") return product.stock === 0;
    return true;
  });

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Stock Overview</h1>

      <div className={styles.filters}>
        <button
          className={filter === "all" ? styles.active : ""}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={filter === "low" ? styles.active : ""}
          onClick={() => setFilter("low")}
        >
          Low Stock
        </button>
        <button
          className={filter === "out" ? styles.active : ""}
          onClick={() => setFilter("out")}
        >
          Out of Stock
        </button>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Product</th>
            <th>Stock</th>
            <th>Min Stock</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.stock}</td>
              <td>{product.minStock}</td>
              <td>
                {product.stock === 0
                  ? "Out of Stock"
                  : product.stock < product.minStock
                  ? "Low"
                  : "OK"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

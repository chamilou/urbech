// src/components/ProductTable.js
"use client";
import Link from "next/link";
import styles from "@/app/dashboard/products/products.module.css";

export default function ProductTable({ products, onDelete }) {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
          <th>Category</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr key={product.id}>
            <td>{product.name}</td>
            <td>${product.price}</td>
            <td>{product.category?.name || "Uncategorized"}</td>
            <td>
              <Link
                href={`/dashboard/products/edit/${product.id}`}
                className={styles.editButton}
              >
                Edit
              </Link>
              <button
                onClick={() => onDelete(product.id)}
                className={styles.deleteButton}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

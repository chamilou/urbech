// src/components/ProductTable.js
"use client";
import Link from "next/link";
import Image from "next/image";
import styles from "@/app/dashboard/products/products.module.css";

export default function ProductTable({ products, onDelete }) {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Изобр.</th>
          <th>Наимениование</th>
          <th>Цена</th>
          <th>Описание</th>
          <th>Остаток</th>
          <th>Категория</th>
          <th>###</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr key={product.id}>
            <td>
              <Image
                alt={product.description||"".slice(0, 10)||"Unknown"}
                src={product.mainImage||"/placeholder-image.jpg"}
                width={30}
                height={30}
              ></Image>
            </td>
            <td>{product.name}</td>
            <td>{product.price}</td>
            <td>{product.description||"".slice(0, 9)}</td>
            <td>{product.stock}</td>
            <td>{product.category?.name || "Uncategorized"}</td>
            <td>
              <Link
                href={`/dashboard/products/${product.id}/edit/`}
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

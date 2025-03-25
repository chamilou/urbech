// import AddProductPage from "../components/ui/AddProduct";

// export default function Dashboard() {
//   return (
//     <div>
//       <h1>Dashboard</h1>
//       <AddProductPage></AddProductPage>
//     </div>
//   );
// }
// src/app/dashboard/page.js
"use client";
import Link from "next/link";
import styles from "./dashboard.module.css";

export default function DashboardPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Admin Dashboard</h1>
      <div className={styles.grid}>
        {/* Products Card */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Manage Products</h2>
          <p className={styles.cardDescription}>
            Add, edit, or delete products in your store.
          </p>
          <Link href="/dashboard/products" className={styles.cardButton}>
            Go to Products
          </Link>
        </div>

        {/* Categories Card */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Manage Categories</h2>
          <p className={styles.cardDescription}>
            Add, edit, or delete product categories.
          </p>
          <Link href="/dashboard/categories" className={styles.cardButton}>
            Go to Categories
          </Link>
        </div>

        {/* Orders Card */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Manage Orders</h2>
          <p className={styles.cardDescription}>
            View and manage customer orders.
          </p>
          <Link href="/dashboard/orders" className={styles.cardButton}>
            Go to Orders
          </Link>
        </div>

        {/* Users Card */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Manage Users</h2>
          <p className={styles.cardDescription}>
            View and manage user accounts.
          </p>
          <Link href="/dashboard/users" className={styles.cardButton}>
            Go to Users
          </Link>
        </div>
      </div>
    </div>
  );
}

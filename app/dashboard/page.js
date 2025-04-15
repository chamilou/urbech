"use client";
import Link from "next/link";
import styles from "./dashboard.module.css";

export const dynamic = "force-dynamic";
export default function DashboardPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Admin Dashboard</h1>
      <div className={styles.grid}>
        {/* Products Card */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Manage Products</h2>
          <p className={styles.cardDescription}>
            Add, edit, or delete products and categories in your store.
          </p>
          <Link href="/dashboard/products" className={styles.cardButton}>
            Go to Products
          </Link>
        </div>
        {/* Orders Card */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Manage Orders</h2>
          <p className={styles.cardDescription}>
            View and manage customer orders.
          </p>
          <Link href="/orders" className={styles.cardButton}>
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
        {/* Stock Card */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Stock Management</h2>
          <p className={styles.cardDescription}>
            Monitor product stock levels and restock alerts.
          </p>
          <Link href="/dashboard/stock" className={styles.cardButton}>
            Go to Stock
          </Link>
        </div>
        {/* Google Card */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Google & SEO</h2>
          <p className={styles.cardDescription}>
            All related to google and SEO.
          </p>
          <Link href="#" className={styles.cardButton}>
            Go to SEO
          </Link>
        </div>
        {/* Partners Management */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Partners Management</h2>
          <p className={styles.cardDescription}>
            All related to suppliers and partners.
          </p>
          <Link href="/dashboard/partners" className={styles.cardButton}>
            Go to Partners
          </Link>
        </div>
        {/* Partners Management */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Settings</h2>
          <p className={styles.cardDescription}>Settings for system.</p>
          <Link href="/dashboard/settings" className={styles.cardButton}>
            Go to Settings
          </Link>
        </div>
        {/* Emails MAnagement */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Emails</h2>
          <p className={styles.cardDescription}>Settings for system.</p>
          <Link href="/dashboard/emails" className={styles.cardButton}>
            Go to Emails
          </Link>
        </div>
      </div>
    </div>
  );
}

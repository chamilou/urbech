"use client";
import Link from "next/link";
import styles from "@/app/dashboard/products/products.module.css";

export default function UserTable({ users, onDelete }) {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Created At</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>{user.role}</td>
            <td>{new Date(user.createdAt).toLocaleDateString()}</td>
            <td>
              <Link
                href={`/dashboard/users/${user.id}/edit`}
                className={styles.editButton}
              >
                Edit
              </Link>
              <button
                onClick={() => onDelete(user.id)}
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

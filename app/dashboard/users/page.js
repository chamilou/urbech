"use client";

import { useEffect, useState } from "react";
import UserTable from "@/app/components/UserTable";
import styles from "@/app/dashboard/products/products.module.css";
import toast from "react-hot-toast";
export default function UsersPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch("/api/users");
      const data = await res.json();
      if (res.ok) {
        setUsers(data);
      } else {
        console.error(data.error);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    // For now, just remove from state. Later: add DELETE /api/users/[id]
    const confirm = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (!confirm) return;

    // setUsers((prev) => prev.filter((u) => u.id !== userId));
    try {
      await fetch(`/api/users/${userId}`, { method: "DELETE" });
      setUsers(users.filter((user) => user.id !== userId));
      toast.success("User deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>All Users</h1>
      <UserTable users={users} onDelete={handleDelete} />
    </div>
  );
}

"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./Navbar.module.css";
import { useAuth } from "@/app/context/AuthContext";
import { jwtDecode } from "jwt-decode"; // Correct named import

export default function Navbar() {
  const router = useRouter();
  const isLoggedIn = useAuth(); // Detects if user is logged in
  const [username, setUsername] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  // Function to check if token is expired
  const isTokenExpired = (token) => {
    try {
      const { exp } = jwtDecode(token);
      return Date.now() >= exp * 1000;
    } catch {
      return true;
    }
  };

  // Fetch user info when logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      if (isTokenExpired(token)) {
        localStorage.removeItem("token");
        setUsername("");
        setIsAdmin(false);
        return;
      }

      try {
        const { name, role } = jwtDecode(token);
        setUsername(name || "User");
        setIsAdmin(role === "ADMIN");
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    } else {
      setUsername("");
      setIsAdmin(false);
    }
  }, [isLoggedIn]); // Depend on `isLoggedIn` to refresh UI when auth state changes

  // Handle Logout
  const handleLogout = async () => {
    try {
      const response = await fetch("/api/logout", { method: "POST" });
      if (response.ok) {
        localStorage.removeItem("token");
        setUsername("");
        setIsAdmin(false);
        router.push("/login");
        router.refresh(); // Ensure UI updates
      } else {
        console.error("Logout failed:", await response.json());
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.left}>
        <Link href="/">Urbech</Link>
        <Link href="/products">Products</Link>
      </div>
      <div className={styles.right}>
        {isLoggedIn ? (
          <>
            <span>Welcome, {username}</span>
            {isAdmin && <Link href="/dashboard">Dashboard</Link>}{" "}
            {/* Dashboard only for Admins */}
            <button onClick={handleLogout} className={styles.button}>
              Logout
            </button>
          </>
        ) : (
          <Link href="/login">Login</Link> // Show login when logged out
        )}
      </div>
    </nav>
  );
}

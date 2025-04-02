"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./Navbar.module.css";
import { useAuth } from "@/app/context/AuthContext";
import { jwtDecode } from "jwt-decode";
import { useUser } from "@/app/context/UserContext";
import { useCart } from "@/app/context/CartContext";
import { ShoppingCart } from "lucide-react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const { user } = useUser();
  const { isLoggedIn, logout } = useAuth(); // Ensure `logout` updates `isLoggedIn`
  // const [username, setUsername] = useState("");
  // const [isAdmin, setIsAdmin] = useState(false);
  const username = user?.name || "User";
  const isAdmin = user?.role === "ADMIN";

  const { itemCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  // Check token and update user info

  // useEffect(() => {
  //   if (user) {
  //     setUsername(user.name || "User");
  //     setIsAdmin(user.role === "ADMIN");
  //   } else {
  //     setUsername("");
  //     setIsAdmin(false);
  //   }
  // }, [user]); // Just depend on user context

  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);
  }, [menuOpen]);

  // useEffect(() => {
  //   const token = localStorage.getItem("token");

  //   // Early return if no token
  //   if (!token?.trim()) {
  //     setUsername("");
  //     setIsAdmin(false);
  //     return;
  //   }

  //   try {
  //     const decoded = jwtDecode(token);
  //     const { exp, name, role } = decoded;

  //     // Check expiration
  //     if (Date.now() >= exp * 1000) {
  //       localStorage.removeItem("token");
  //       throw new Error("Token expired");
  //     }

  //     setUsername(name || "User");
  //     setIsAdmin(role === "ADMIN");
  //   } catch (error) {
  //     console.error("Token error:", error);
  //     localStorage.removeItem("token");
  //     setUsername("");
  //     setIsAdmin(false);
  //   }
  // }, [isLoggedIn]); // Sync with global auth state

  // Handle logout
  const handleLogout = async () => {
    try {
      const response = await fetch("/api/logout", { method: "POST" });
      if (response.ok) {
        localStorage.removeItem("token");
        logout(); // Call `logout` from AuthContext to update global state
        router.push("/login");
        router.refresh(); // Force Next.js to re-render the layout
      } else {
        console.error("Logout failed:", await response.text());
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };
  {
    isLoggedIn ? (
      <>
        <span>Welcome, {username}</span>
        {isAdmin && <Link href="/dashboard">Dashboard</Link>}
        <button onClick={handleLogout} className={styles.button}>
          Logout
        </button>
      </>
    ) : (
      <Link href="/login">Login</Link>
    );
  }

  return (
    <nav className={styles.navbar}>
      <div className={styles.left}>
        <Link href="/">Home</Link>
        <Link href="/products">Products</Link>
      </div>

      <button
        className={`${styles.hamburger} ${menuOpen ? styles.open : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-expanded={menuOpen}
        aria-label="Toggle navigation menu"
      >
        {menuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div className={`${styles.right} ${menuOpen ? styles.active : ""}`}>
        <Link href="/cart" className={styles.cartLink}>
          <ShoppingCart className={styles.cartIcon} size={24} />
          {itemCount > 0 && (
            <span className={styles.cartCount}>{itemCount}</span>
          )}
        </Link>

        {isLoggedIn ? (
          <>
            {username && <span>Welcome, {username}</span>}
            {isAdmin && <Link href="/dashboard">Dashboard</Link>}
            <button onClick={handleLogout} className={styles.button}>
              Logout
            </button>
          </>
        ) : (
          <Link href="/login">Login</Link>
        )}
      </div>
    </nav>
  );
}

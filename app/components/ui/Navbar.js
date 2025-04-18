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
import { usePathname } from "next/navigation";

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


  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);
  }, [menuOpen]);

  
  useEffect(() => {
    let lastScroll = 0;
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      const navbar = document.querySelector(`.${styles.navbar}`);

      if (currentScroll > lastScroll && currentScroll > 100) {
        // Scrolling down
        navbar.style.transform = "translateY(-100%)";
      } else {
        // Scrolling up
        navbar.style.transform = "translateY(0)";
      }
      lastScroll = currentScroll;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
        <Link href="/" className={styles.button}>
          Домой
        </Link>
        <Link href="/products" className={styles.button}>
          Продукты
        </Link>
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
          <ShoppingCart className={styles.cartIcon} size={28} />
          {itemCount > 0 && (
            <span className={styles.cartCount}>{itemCount}</span>
          )}
        </Link>
        

        {isLoggedIn ? (
          <>
            {username && <span>Welcome, {username}</span>}
            {/* {isAdmin && <Link href="/dashboard">Dashboard</Link>} */}
            {isAdmin ? (
              <Link href="/dashboard">Админ</Link>
            ) : (
              <Link href="/profile">Профиль</Link>
            )}
        
            <button onClick={handleLogout} className={styles.button}>
              Выход
            </button>
          </>
        ) : (
          <Link href="/login">Вход</Link>
        )}
      </div>
    </nav>
  );
}

const locales = [
  { code: "en", label: "EN" },
  { code: "fr", label: "FR" },
  { code: "ru", label: "RU" },
];

function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const currentLocale = pathname.split("/")[1] || "en"; // Default to 'en' if no locale is found

  const handleChange = (e) => {
    const newLocale = e.target.value;
    const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}(?=\/|$)/, ""); // remove locale
    const newPath = `/${newLocale}${
      pathWithoutLocale.startsWith("/") ? "" : "/"
    }${pathWithoutLocale}`;

    router.push(newPath);
  };

  return (
    <select onChange={handleChange} value={currentLocale}>
      {locales.map(({ code, label }) => (
        <option key={code} value={code}>
          {label}
        </option>
      ))}
    </select>
  );
}

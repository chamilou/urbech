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
        <Link href="/">Домой</Link>
        <Link href="/products">Продукты</Link>
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
            {/* {isAdmin && <Link href="/dashboard">Dashboard</Link>} */}
            {isAdmin ? (
              <Link href="/dashboard">Dashboard</Link>
            ) : (
              <Link href="/profile">Profile</Link>
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
// "use client";
// import Link from "next/link";
// import { useRouter, usePathname } from "next/navigation";
// import { useEffect, useState } from "react";
// import styles from "./Navbar.module.css";
// import { useAuth } from "@/app/context/AuthContext";
// import { useUser } from "@/app/context/UserContext";
// import { useCart } from "@/app/context/CartContext";
// import { ShoppingCart, Menu, X } from "lucide-react";
// import { useLocale, useTranslations } from "next-intl";

// export default function Navbar() {
//   const router = useRouter();
//   const pathname = usePathname();
//   const locale = useLocale();
//   const t = useTranslations("Navbar");

//   const { user } = useUser();
//   const { isLoggedIn, logout } = useAuth();
//   const { itemCount } = useCart();
//   const [menuOpen, setMenuOpen] = useState(false);

//   const username = user?.name || t("user");
//   const isAdmin = user?.role === "ADMIN";

//   useEffect(() => {
//     document.body.classList.toggle("menu-open", menuOpen);
//     return () => document.body.classList.remove("menu-open");
//   }, [menuOpen]);

//   const handleLogout = async () => {
//     try {
//       const response = await fetch("/api/logout", { method: "POST" });
//       if (response.ok) {
//         localStorage.removeItem("token");
//         logout();
//         router.push(`/${locale}/login`);
//         router.refresh();
//       }
//     } catch (error) {
//       console.error("Error during logout:", error);
//     }
//   };

//   return (
//     <nav className={styles.navbar}>
//       <div className={styles.left}>
//         <Link href={`/${locale}`}>{t("home")}</Link>
//         <Link href={`/${locale}/products`}>{t("products")}</Link>
//       </div>

//       <button
//         className={`${styles.hamburger} ${menuOpen ? styles.open : ""}`}
//         onClick={() => setMenuOpen(!menuOpen)}
//         aria-expanded={menuOpen}
//         aria-label={t("toggleMenu")}
//       >
//         {menuOpen ? <X size={24} /> : <Menu size={24} />}
//       </button>

//       <div className={`${styles.right} ${menuOpen ? styles.active : ""}`}>
//         <Link href={`/${locale}/cart`} className={styles.cartLink}>
//           <ShoppingCart className={styles.cartIcon} size={24} />
//           {itemCount > 0 && (
//             <span className={styles.cartCount}>{itemCount}</span>
//           )}
//         </Link>

//         {isLoggedIn ? (
//           <>
//             {username && <span>{t("welcome", { username })}</span>}
//             {isAdmin && (
//               <Link href={`/${locale}/dashboard`}>{t("dashboard")}</Link>
//             )}
//             <button onClick={handleLogout} className={styles.button}>
//               {t("logout")}
//             </button>
//           </>
//         ) : (
//           <Link href={`/${locale}/login`}>{t("login")}</Link>
//         )}
//         <LanguageSwitcher currentLocale={locale} pathname={pathname} />
//       </div>
//     </nav>
//   );
// }

// const locales = [
//   { code: "en", label: "EN" },
//   { code: "fr", label: "FR" },
//   { code: "ru", label: "RU" },
// ];

// function LanguageSwitcher({ currentLocale, pathname }) {
//   const router = useRouter();
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   if (!mounted) return null;

//   const handleChange = (e) => {
//     const newLocale = e.target.value;
//     const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, "") || "/";
//     router.push(`/${newLocale}${pathWithoutLocale}`);
//   };

//   return (
//     <select
//       onChange={handleChange}
//       value={currentLocale}
//       aria-label="Change language"
//     >
//       {locales.map(({ code, label }) => (
//         <option key={code} value={code}>
//           {label}
//         </option>
//       ))}
//     </select>
//   );
// }

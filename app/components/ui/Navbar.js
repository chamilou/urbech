// "use client";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import styles from "./Navbar.module.css";
// import { useAuth } from "@/app/context/AuthContext";
// import { jwtDecode } from "jwt-decode"; // Correct named import

// export default function Navbar() {
//   const router = useRouter();
//   const [isLoggedIn, logout] = useAuth(); // Detects if user is logged in
//   const [username, setUsername] = useState("");
//   const [isAdmin, setIsAdmin] = useState(false);

//   // Function to check if token is expired
//   const isTokenExpired = (token) => {
//     try {
//       const { exp } = jwtDecode(token);
//       return Date.now() >= exp * 1000;
//     } catch {
//       return true;
//     }
//   };

//   // Fetch user info when logged in
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       if (isTokenExpired(token)) {
//         localStorage.removeItem("token");
//         setUsername("");
//         setIsAdmin(false);
//         return;
//       }

//       try {
//         const { name, role } = jwtDecode(token);
//         setUsername(name || "User");
//         setIsAdmin(role === "ADMIN");
//       } catch (error) {
//         console.error("Error decoding token:", error);
//       }
//     } else {
//       setUsername("");
//       setIsAdmin(false);
//     }
//   }, [isLoggedIn]); // Depend on `isLoggedIn` to refresh UI when auth state changes

//   // Handle Logout
//   const handleLogout = async () => {
//     try {
//       const response = await fetch("/api/logout", { method: "POST" });
//       if (response.ok) {
//         localStorage.removeItem("token");
//         setUsername("");
//         setIsAdmin(false);
//         router.push("/login");
//         router.refresh(); // Ensure UI updates
//       } else {
//         console.error("Logout failed:", await response.json());
//       }
//     } catch (error) {
//       console.error("Error during logout:", error);
//     }
//   };

//   return (
//     <nav className={styles.navbar}>
//       <div className={styles.left}>
//         <Link href="/">Urbech</Link>
//         <Link href="/products">Products</Link>
//       </div>
//       <div className={styles.right}>
//         {isLoggedIn ? (
//           <>
//             <span>{username}</span>
//             {isAdmin && <Link href="/dashboard">Dashboard</Link>}{" "}
//             {/* Dashboard only for Admins */}
//             <button onClick={handleLogout} className={styles.button}>
//               Logout
//             </button>
//           </>
//         ) : (
//           <Link href="/login">Login</Link> // Show login when logged out
//         )}
//       </div>
//     </nav>
//   );
// }

"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./Navbar.module.css";
import { useAuth } from "@/app/context/AuthContext";
import { jwtDecode } from "jwt-decode";

export default function Navbar() {
  const router = useRouter();
  const { isLoggedIn, logout } = useAuth(); // Ensure `logout` updates `isLoggedIn`
  const [username, setUsername] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  // Check token and update user info
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUsername("");
      setIsAdmin(false);
      return;
    }

    try {
      const { exp, name, role } = jwtDecode(token);
      if (Date.now() >= exp * 1000) {
        localStorage.removeItem("token");
        setUsername("");
        setIsAdmin(false);
        return;
      }
      setUsername(name || "User");
      setIsAdmin(role === "ADMIN");
    } catch (error) {
      console.error("Error decoding token:", error);
      localStorage.removeItem("token");
    }
  }, [isLoggedIn]); // Re-run when `isLoggedIn` changes

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

  return (
    <nav className={styles.navbar}>
      <div className={styles.left}>
        <Link href="/">Home</Link>
        <Link href="/products">Products</Link>
      </div>
      <div className={styles.right}>
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

// "use client"; // Mark this as a Client Component

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import styles from "./Login.module.css";
// import { useAuth } from "../context/AuthContext";

// export default function LoginPage() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const router = useRouter();
//   const { login } = useAuth();

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await fetch("/api/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await response.json();

//       if (response.ok && data.token) {
//         const token = data.token;

//         localStorage.setItem("token", token);
//         login(token); //  AuthContext will decode it

//         // Decode token to get role
//         const { role } = JSON.parse(atob(token.split(".")[1]));

//         // Redirect based on role
//         if (role === "ADMIN") {
//           router.push("/dashboard");
//         } else {
//           router.push("/");
//         }
//       } else {
//         setError(data.message || "Login failed");
//       }
//     } catch (err) {
//       setError("An error occurred. Please try again.");
//     }
//   };

//   return (
//     <div className={styles.container}>
//       <h1>Login</h1>
//       {error && <p className={styles.error}>{error}</p>}
//       <form onSubmit={handleSubmit} className={styles.form}>
//         <div className={styles.formGroup}>
//           <label htmlFor="email">Email</label>
//           <input
//             type="email"
//             id="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//         </div>
//         <div className={styles.formGroup}>
//           <label htmlFor="password">Password</label>
//           <input
//             type="password"
//             id="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//         </div>
//         <button type="submit" className={styles.button}>
//           Login
//         </button>
//       </form>
//       <p>
//         Don’t have an account? <a href="/register">Register here</a>
//       </p>
//     </div>
//   );
// }

"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { jwtDecode } from "jwt-decode";
import styles from "./Login.module.css";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login, isLoggedIn } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn) router.push("/");
  }, [isLoggedIn, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setError("");
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      const token = data.token;
      localStorage.setItem("token", token);
      login(token);

      const { role } = jwtDecode(token);
      router.push(role === "ADMIN" ? "/dashboard" : "/");
    } catch (err) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Login</h1>
      {error && <p className={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>
        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <p>
        Don’t have an account? <Link href="/register">Register here</Link>
      </p>
    </div>
  );
}

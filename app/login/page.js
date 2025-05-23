// "use client";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import styles from "./Login.module.css";
// import { useAuth } from "@/app/context/AuthContext";
// import toast from "react-hot-toast";
// export const dynamic = "force-dynamic";
// export default function LoginPage() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();
//   const { login } = useAuth();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       const response = await fetch("/api/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await response.json();

//       if (!response.ok) throw new Error(data.error || "Login failed");

//       // Debug: log token to confirm it's there
//       console.log("Token received:", data.token);

//       if (!data.token) throw new Error("No token received from server");

//       login({
//         token: data.token,
//         ...data.user,
//       });
//       toast.success("Logged in Successfully");

//       // router.push(data.user.role === "ADMIN" ? "/dashboard" : "/");
//       // router.refresh();
//       window.location.href = data.user.role === "ADMIN" ? "/dashboard" : "/";
//     } catch (err) {
//       setError(err.message || "An error occurred. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className={styles.container}>
//       <h1>"Login"</h1>
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
//             minLength={6}
//           />
//         </div>
//         <button type="submit" className={styles.button} disabled={loading}>
//           {loading ? "Logging in..." : "Login"}
//         </button>
//       </form>
//       <p>
//         Don’t have an account? <Link href="/register">Register here</Link>
//       </p>
//     </div>
//   );
// }
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./Login.module.css";
import { useAuth } from "@/app/context/AuthContext";
// import toast from "react-hot-toast";
import { toast } from "react-hot-toast";
export const dynamic = "force-dynamic";
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Login failed");

      // Debug: log token to confirm it's there
      console.log("Token received:", data.token);

      if (!data.token) throw new Error("No token received from server");

      login({
        token: data.token,
        ...data.user,
      });
      
      
      toast.success(`You are logged in as ${data.user.name}` ,

        {duration:2000}
      );
      setTimeout(()=>{

        window.location.href = data.user.role === "ADMIN" ? "/dashboard" : "/";
      },2000)
    } catch (err) {
      setError(err.message || "An error occurred. Please try again.");
      toast.error(err.message || "Login failed");
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
        <div className={styles.forgotPassword}>
          <Link href="/forgot-password">Forgot password?</Link>
        </div>
        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <p>
        Don't have an account? <Link href="/register">Register here</Link>
      </p>
    </div>
  );
}
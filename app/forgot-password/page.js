"use client";
import { useState } from "react";
import Link from "next/link";
import styles from "./forgot-password.module.css";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Request failed");
      
      toast.success("Password reset link sent to your email!");
      setSuccess(true);
    } catch (err) {
      toast.error(err.message || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Forgot Password</h1>
      
      {success ? (
        <div className={styles.success}>
          <p>Check your email for a password reset link.</p>
          <Link href="/login" className={styles.backToLogin}>
            Back to Login
          </Link>
        </div>
      ) : (
        <>
          <p>Enter your email to receive a password reset link</p>
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
            <button type="submit" className={styles.button} disabled={loading}>
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        </>
      )}

      <div className={styles.footer}>
        Remember your password? <Link href="/login">Login here</Link>
      </div>
    </div>
  );
}
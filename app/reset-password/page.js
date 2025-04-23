// app/reset-password/page.jsx
"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import Link from "next/link";
import styles from "./reset-password.module.css";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      toast.error("Passwords don't match");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Password reset failed");

      toast.success("Password updated successfully!");
      // Redirect after 2 seconds
      setTimeout(() => window.location.href = "/login", 2000);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className={styles.container}>
        <h1>Invalid Reset Link</h1>
        <p>The password reset link is invalid or has expired.</p>
        <Link href="/forgot-password">Request new reset link</Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1>Reset Your Password</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="password">New Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading} className={styles.button}>
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}
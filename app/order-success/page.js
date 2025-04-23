"use client";
export const dynamic = "force-dynamic";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OrderSuccess() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/");
    }, 10000); // 10 seconds

    return () => clearTimeout(timer); // Cleanup on unmount
  }, [router]);

  return (
    <div className="success-container">
      <h1>Order Successful!</h1>
      <p>Thank you for your purchase.</p>
      <p>You'll be redirected to the home page in 10 seconds...</p>
    </div>
  );
}
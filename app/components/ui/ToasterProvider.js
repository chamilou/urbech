"use client";
import { Toaster } from "react-hot-toast";

export default function ToasterProvider() {
  return <Toaster 
    position="top-right"
    toastOptions={{
      duration: 4000, // Default duration for all toasts
      style: {
        background: '#363636',
        color: '#fff',
      },
    }}
  />;
}
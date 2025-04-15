// components/CookieConsent.js
"use client";

import { useEffect, useState } from "react";
import styles from "./CookieConsent.module.css";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) setVisible(true);
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className={styles.banner}>
      <p>
        Мы используем файлы cookie, чтобы улучшить ваш опыт. Продолжая
        использовать этот сайт, вы соглашаетесь с использованием файлов cookie.
      </p>

      <button onClick={handleAccept} className={styles.button}>
        Принять
      </button>
    </div>
  );
}

// app/components/Footer/Footer.js
"use client";
import styles from "./Footer.module.css";
// import FooterCol1 from "./FooterCol1";
// import FooterCol2 from "./FooterCol2";
// import FooterCol3 from "./FooterCol3";
import FooterCol4 from "./FooterCol4";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.columns}>
        {/* <FooterCol1 /> */}
         {/* <FooterCol2 />  */}
         {/* <FooterCol3 />  */}
        <FooterCol4 />
      </div>
      <p className={styles.copy}>
        © {new Date().getFullYear()} Urbech-Shop. All rights reserved.
      </p>
    </footer>
  );
}

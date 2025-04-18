import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "./components/ui/Navbar";
import { AuthProvider } from "./context/AuthContext";
import { UserProvider } from "./context/UserContext";
import { CartProvider } from "./context/CartContext";
import { getUserFromCookie } from "@/lib/getUserFromCookie";
import ToasterProvider from "./components/ui/ToasterProvider";
import Footer from "./components/footer/Footer";
import CookieConsent from "./components/cookies/CookieConsent";
import { Providers } from "./providers";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  title: "Urbech-Shop",
  description: "Urbech-Shop - Your online store for natural products",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export const dynamic = "force-dynamic";

export default async function RootLayout({ children }) {
  const user = await getUserFromCookie();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased page-container`}
      >
        

        <ToasterProvider />
        <UserProvider initialUser={user}>
          <CartProvider>
            <AuthProvider>
              <Navbar />

              <main>{children}</main>
              <CookieConsent />
            </AuthProvider>
          </CartProvider>
        </UserProvider>
        <Footer />
        
      </body>
    </html>
  );
}

import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "./components/ui/Navbar";
import { AuthProvider } from "./context/AuthContext";
import { UserProvider } from "./context/UserContext";
import { CartProvider } from "./context/CartContext";
import { getUserFromCookie } from "@/lib/getUserFromCookie";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({ children }) {
  const user = await getUserFromCookie();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <UserProvider initialUser={user}>
          <CartProvider>
            <AuthProvider>
              <Navbar />
              {children}
            </AuthProvider>
          </CartProvider>
        </UserProvider>
      </body>
    </html>
  );
}

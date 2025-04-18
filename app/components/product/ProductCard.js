

// app/components/ProductCard.js
"use client";
import styles from "./ProductCard.module.css";
import { useCart } from "@/app/context/CartContext";
import {useState} from "react"
import {useRouter} from "next/navigation"
import Link from "next/link";
import Image from "next/image";
import { useUser } from "@/app/context/UserContext";
// import ButtonLink from "../widgets/Button";
import ToasterProvider from "../ui/ToasterProvider";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const router =useRouter;
  const user =useUser();
  const toast = ToasterProvider();

  return (
    <div className={styles.productCard}>
      <div className={styles.imageWrapper}>
        <div className={styles.badges}>
          {product.isTopProduct && <span className={styles.topBadge}>TOP</span>}
          {product.isNewProduct && <span className={styles.newBadge}>NEW</span>}
        </div>
        <button className={styles.wishlistButton} >&hearts;</button>


       
        <div className={styles.stars}>★★★★☆</div>

        <Link key={product.id} href={`/products/${product.id}`}>
          <Image
            src={product.mainImage}
            alt={product.name}
            // width={250}
            // height={200}
            className={styles.productImage}
            fill
          />
        </Link>
      </div>

      <div className={styles.productInfo}>
        <h2 className={styles.name}>{product.name}</h2>
        <p className={styles.price}>${product.price.toFixed(2)}</p>

        {product.pricePerUnit && (
          <p className={styles.pricePerKg}>
            (${product.pricePerUnit.toFixed(2)} / kg)
          </p>
        )}

        <p className={styles.metaInfo}>
          Art.N°: {product.articleNumber || "N/A"} | Stock:{" "}
          {product.stock || "N/A"}
        </p>

        <p className={styles.delivery}>Delivery: 1–2 days</p>

        <button
          className={styles.addToCartButton}
          onClick={() => addToCart(product)}
        >
          В корзину
        </button>
      </div>
    </div>
  );
}


//session approach not working correctly

// "use client";
// import styles from "./ProductCard.module.css";
// import { useCart } from "@/app/context/CartContext";
// import Link from "next/link";
// import Image from "next/image";
// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import { useState, useEffect } from "react";
// import toast from "react-hot-toast";

// export default function ProductCard({ product }) {
//   const { addToCart } = useCart();
//   const { data: session, status } = useSession();
//   const router = useRouter();
//   const [isWishlisted, setIsWishlisted] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   // Check wishlist status only when authenticated
//   useEffect(() => {
//     if (status === "authenticated" && session?.user?.id) {
//       checkWishlistStatus();
//     } else {
//       setIsWishlisted(false); // Reset for logged out users
//     }
//   }, [status, session]);

//   const checkWishlistStatus = async () => {
//     if (!session?.user?.id) return;
    
//     try {
//       setIsLoading(true);
//       const res = await fetch(`/api/users/${session.user.id}/wishlist/check`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ productId: product.id }),
//       });
      
//       if (!res.ok) throw new Error("Failed to check wishlist");
      
//       const data = await res.json();
//       setIsWishlisted(data.isWishlisted);
//     } catch (error) {
//       console.error("Wishlist check failed:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleWishlistClick = () => {
//     if (status === "unauthenticated" || !session?.user) {
//       toast.error("Please login to use wishlist");
//       router.push(`/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`);
//       return;
//     }

//     toggleWishlist();
//   };

//   const toggleWishlist = async () => {
//     if (!session?.user?.id || isLoading) return;
    
//     setIsLoading(true);
//     try {
//       const method = isWishlisted ? "DELETE" : "POST";
//       const res = await fetch(`/api/users/${session.user.id}/wishlist`, {
//         method,
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ productId: product.id }),
//       });

//       if (res.ok) {
//         const newState = !isWishlisted;
//         setIsWishlisted(newState);
//         toast.success(newState ? "Added to wishlist" : "Removed from wishlist");
//       }
//     } catch (error) {
//       toast.error("Failed to update wishlist");
//       console.error("Wishlist update failed:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className={styles.productCard}>
//       <div className={styles.imageWrapper}>
//         <div className={styles.badges}>
//           {product.isTopProduct && <span className={styles.topBadge}>TOP</span>}
//           {product.isNewProduct && <span className={styles.newBadge}>NEW</span>}
//         </div>
        
//         <button
//           className={`${styles.wishlistButton} ${
//             isWishlisted ? styles.active : ""
//           } ${isLoading ? styles.loading : ""}`}
//           onClick={handleWishlistClick}
//           disabled={isLoading}
//           aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
//         >
//           {isLoading ? (
//             <span className={styles.spinner}></span>
//           ) : isWishlisted ? (
//             "♥"
//           ) : (
//             "♡"
//           )}
//         </button>
        
//         <div className={styles.stars}>★★★★☆</div>

//         <Link href={`/products/${product.id}`} passHref>
//           <Image
//             src={product.mainImage}
//             alt={product.name}
//             className={styles.productImage}
//             fill
//             sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//           />
//         </Link>
//       </div>

//       <div className={styles.productInfo}>
//         <h2 className={styles.name}>{product.name}</h2>
//         <p className={styles.price}>${product.price.toFixed(2)}</p>

//         {product.pricePerUnit && (
//           <p className={styles.pricePerKg}>
//             (${product.pricePerUnit.toFixed(2)} / kg)
//           </p>
//         )}

//         <p className={styles.metaInfo}>
//           Art.N°: {product.articleNumber || "N/A"} | Stock:{" "}
//           {product.stock || "N/A"}
//         </p>

//         <p className={styles.delivery}>Delivery: 1–2 days</p>

//         <button
//           className={styles.addToCartButton}
//           onClick={() => addToCart(product)}
//         >
//           В корзину
//         </button>
//       </div>
//     </div>
//   );
// }
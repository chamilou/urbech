import { getServerSession } from "next-auth";
import prisma from "@/lib/db";
import ProductCard from "@/app/components/product/ProductCard";
import styles from "./wishlist.module.css";

export default async function WishlistPage() {
  const session = await getServerSession();
  
  if (!session) {
    return (
      <div className={styles.container}>
        <p>Please log in to view your wishlist</p>
      </div>
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      wishlistItems: true
    }
  });

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Your Wishlist</h1>
      
      {user.wishlistItems.length === 0 ? (
        <p className={styles.emptyMessage}>Your wishlist is empty</p>
      ) : (
        <div className={styles.productsGrid}>
          {user.wishlistItems.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
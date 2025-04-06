"use client";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import styles from "./home.module.css";
import ProductCard from "@/app/components/product/ProductCard";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function HomePage() {
  const [newProducts, setNewProducts] = useState([]);

  useEffect(() => {
    const fetchNewProducts = async () => {
      const res = await fetch("./api/products");
      const data = await res.json();
      const recent = data.filter((p) => p.isNewProduct);
      setNewProducts(recent);
    };
    fetchNewProducts();
  }, []);

  return (
    <div className={styles.carouselWrapper}>
      <div className={styles.carouselContainer}>
        <Carousel
          showThumbs={false}
          autoPlay
          infiniteLoop
          interval={4000}
          showStatus={false}
          showArrows={true}
        >
          <div>
            <Image
              className={styles.img}
              src="/banner1.jpg"
              alt="Banner 1"
              width={1200}
              height={175}
              style={{ width: "80%", height: "auto", objectFit: "fill" }}
            />
          </div>
          <div>
            <Image
              className={styles.img}
              src="/banner2.jpg"
              alt="Banner 2"
              width={1200}
              height={175}
              style={{ width: "80%", height: "auto", objectFit: "fill" }}
            />
          </div>
          <div>
            <Image
              className={styles.img}
              src="/banner3.jpg"
              alt="Banner 3"
              width={1200}
              height={175}
              style={{ width: "80%", height: "auto", objectFit: "fill" }}
            />
          </div>
        </Carousel>
      </div>

      <h2 className={styles.sectionTitle}>New Arrivals</h2>
      <div className={styles.productGrid}>
        {newProducts.length > 0 ? (
          newProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p>No new products available.</p>
        )}
      </div>
    </div>
  );
}

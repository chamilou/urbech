// "use client";
// import { useEffect, useState } from "react";
// import styles from "./Products.module.css";
// import ProductCard from "@/app/components/product/ProductCard";

// export default function ProductsPage() {
//   const [products, setProducts] = useState([]);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const response = await fetch("/api/products");
//         const data = await response.json();
//         if (response.ok) {
//           setProducts(data);
//         } else {
//           console.error("Failed to fetch products:", data.message);
//         }
//       } catch (error) {
//         console.error("Error fetching products:", error);
//       }
//     };

//     fetchProducts();
//   }, []);

//   return (
//     <div className={styles.container}>
//       <h1>Products</h1>
//       <div className={styles.productGrid}>
//         {products.map((product) => (
//           <ProductCard key={product.id} product={product} />
//         ))}
//       </div>
//     </div>
//   );
// }
"use client";
import { useEffect, useState } from "react";
import styles from "./Products.module.css";
import ProductCard from "@/app/components/product/ProductCard";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
    };
    fetchProducts();
  }, []);

  // ✅ Filter logic
  const filtered = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.description?.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || product.category?.name === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // ✅ Grab unique categories
  const categories = [
    "all",
    ...new Set(products.map((p) => p.category?.name).filter(Boolean)),
  ];

  return (
    <div className={styles.container}>
      <h1>All products</h1>

      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.searchInput}
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className={styles.categorySelect}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.productGrid}>
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

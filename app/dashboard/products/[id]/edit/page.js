// // src/app/dashboard/products/edit/[id]/page.js
// "use client";
// import { useState, useEffect } from "react";
// import { useRouter, useParams } from "next/navigation";
// import styles from "./edit.module.css";

// export default function EditProductPage() {
//   const [name, setName] = useState("");
//   const [price, setPrice] = useState("");
//   const [description, setDescription] = useState("");
//   const [categoryId, setCategoryId] = useState("");
//   const [error, setError] = useState("");
//   const router = useRouter();
//   const { id } = useParams();

//   useEffect(() => {
//     fetchProduct();
//   }, [id]);

//   const fetchProduct = async () => {
//     try {
//       const response = await fetch(`/api/products/${id}`);
//       const data = await response.json();
//       setName(data.name);
//       setPrice(data.price);
//       setDescription(data.description);
//       setCategoryId(data.categoryId);
//     } catch (error) {
//       console.error("Error fetching product:", error);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch(`/api/products/${id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ name, price, description, categoryId }),
//       });
//       if (response.ok) {
//         router.push("/dashboard/products");
//       } else {
//         setError("Failed to update product");
//       }
//     } catch (error) {
//       setError("An error occurred. Please try again.");
//     }
//   };

//   return (
//     <div className={styles.container}>
//       <h1 className={styles.title}>Edit Product</h1>
//       {error && <p className={styles.error}>{error}</p>}
//       <form onSubmit={handleSubmit}>
//         <div className={styles.formGroup}>
//           <label htmlFor="name" className={styles.label}>
//             Name
//           </label>
//           <input
//             type="text"
//             id="name"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             className={styles.input}
//             required
//           />
//         </div>
//         <div className={styles.formGroup}>
//           <label htmlFor="price" className={styles.label}>
//             Price
//           </label>
//           <input
//             type="number"
//             id="price"
//             value={price}
//             onChange={(e) => setPrice(e.target.value)}
//             className={styles.input}
//             required
//           />
//         </div>
//         <div className={styles.formGroup}>
//           <label htmlFor="description" className={styles.label}>
//             Description
//           </label>
//           <textarea
//             id="description"
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             className={styles.textarea}
//           />
//         </div>
//         <div className={styles.formGroup}>
//           <label htmlFor="categoryId" className={styles.label}>
//             Category
//           </label>
//           <select
//             id="categoryId"
//             value={categoryId}
//             onChange={(e) => setCategoryId(e.target.value)}
//             className={styles.input}
//             required
//           >
//             <option value="">Select a category</option>
//             {/* Fetch and map categories here */}
//           </select>
//         </div>
//         <button type="submit" className={styles.button}>
//           Update Product
//         </button>
//       </form>
//     </div>
//   );
// }
"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import styles from "./edit.module.css";
import Link from "next/link";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id;
  const [product, setProduct] = useState({
    name: "",
    price: "",
    description: "",
  });
  const [loading, setLoading] = useState({
    fetch: true,
    submit: false,
  });
  const [error, setError] = useState("");

  // Fetch product data on load
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading((prev) => ({ ...prev, fetch: true }));
        setError("");

        const res = await fetch(`/api/products/${productId}`);
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Failed to fetch product");
        }

        const data = await res.json();
        setProduct({
          name: data.name || "",
          price: data.price || "",
          description: data.description || "",
        });
      } catch (err) {
        setError(err.message);
        console.error("Fetch error:", err);
      } finally {
        setLoading((prev) => ({ ...prev, fetch: false }));
      }
    };

    fetchProduct();
  }, [productId]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading((prev) => ({ ...prev, submit: true }));
    setError("");

    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: product.name,
          price: parseFloat(product.price), // Ensure number format
          description: product.description,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update product");
      }

      router.push("/products");
      router.refresh(); // Ensure cache is cleared
    } catch (err) {
      setError(err.message);
      console.error("Submission error:", err);
    } finally {
      setLoading((prev) => ({ ...prev, submit: false }));
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  if (loading.fetch) {
    return <div className="container">Loading product data...</div>;
  }

  if (error && !loading.fetch) {
    return (
      <div className="container">
        <p className="error">{error}</p>
        <Link href="/products">Back to Products</Link>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Edit Product</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
            required
            disabled={loading.submit}
          />
        </div>
        <div>
          <label>Price</label>
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleChange}
            required
            step="0.01"
            min="0"
            disabled={loading.submit}
          />
        </div>
        <div>
          <label>Description</label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            required
            disabled={loading.submit}
          />
        </div>
        <button type="submit" disabled={loading.submit}>
          {loading.submit ? "Updating..." : "Update Product"}
        </button>
        {error && <p className="error">{error}</p>}
      </form>
      <Link href="/products">Back to Products</Link>
    </div>
  );
}

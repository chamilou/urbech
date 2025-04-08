"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import styles from "./edit.module.css";
import ProductForm from "@/app/components/product/ProductForm";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id;

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    stock: "0",
    minStock: "5",
    pricePerUnit: "",
    articleNumber: "",
    weight: "",
    length: "",
    width: "",
    height: "",
    color: "",
    isTopProduct: false,
    isNewProduct: false,
    categoryId: "",
  });

  const [mainImage, setMainImage] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState("");
  const [additionalImages, setAdditionalImages] = useState([]);
  const [additionalPreviews, setAdditionalPreviews] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch categories and product data
  useEffect(() => {
    const fetchAll = async () => {
      try {
        setIsLoading(true);
        const [catRes, prodRes] = await Promise.all([
          fetch("/api/categories"),
          fetch(`/api/products/${productId}`),
        ]);

        if (!catRes.ok || !prodRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const categoryData = await catRes.json();
        const productData = await prodRes.json();

        setCategories(categoryData);
        setFormData({
          ...productData,
          price: productData.price?.toString() || "",
          stock: productData.stock?.toString() || "",
          minStock: productData.minStock?.toString() || "5",
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAll();
  }, [productId]);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    try {
      setIsLoading(true);
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategory }),
      });

      if (!res.ok) throw new Error("Category creation failed");

      const newCat = await res.json();
      setCategories((prev) => [...prev, newCat]);
      setFormData((prev) => ({ ...prev, categoryId: newCat.id }));
      setNewCategory("");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const formDataToSend = new FormData();

      // Append text fields
      for (const key in formData) {
        formDataToSend.append(key, formData[key]);
      }

      // Only send new main image if selected
      if (mainImage) {
        formDataToSend.append("mainImage", mainImage);
      }

      // Optional: include additional images if updated
      additionalImages.forEach((img) => {
        formDataToSend.append("additionalImages", img);
      });

      const res = await fetch(`/api/products/${productId}`, {
        method: "PUT",
        headers: {
          // 👇 DO NOT manually set Content-Type here — browser handles it for FormData
          // "Content-Type": "application/json",
        },
        body: formDataToSend,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to update product");
      }
      router.push("/dashboard/products");
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Edit Product</h1>

      {error && <p className={styles.error}>{error}</p>}

      {!isLoading && (
        <ProductForm
          mode="edit"
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          mainImage={mainImage}
          setMainImage={setMainImage}
          mainImagePreview={mainImagePreview}
          setMainImagePreview={setMainImagePreview}
          additionalImages={additionalImages}
          setAdditionalImages={setAdditionalImages}
          additionalPreviews={additionalPreviews}
          setAdditionalPreviews={setAdditionalPreviews}
          newCategory={newCategory}
          setNewCategory={setNewCategory}
          handleAddCategory={handleAddCategory}
          categories={categories}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}

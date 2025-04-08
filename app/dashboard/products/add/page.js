"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import styles from "./add.module.css";
import ProductForm from "@/app/components/product/ProductForm";

export default function AddProductPage() {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    categoryId: "",
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
    isNewProduct: true,
  });

  const [mainImage, setMainImage] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState("");
  const [additionalImages, setAdditionalImages] = useState([]);
  const [additionalPreviews, setAdditionalPreviews] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { token } = useAuth();

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        if (!response.ok) throw new Error("Failed to fetch categories");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError(error.message);
      }
    };

    fetchCategories();
  }, []);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newCategory }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create category");
      }

      const data = await response.json();
      setCategories([...categories, data]);
      setFormData((prev) => ({ ...prev, categoryId: data.id }));
      setNewCategory("");
      setSuccess("Category added successfully");
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      if (
        !formData.name ||
        !formData.price ||
        !formData.categoryId ||
        !mainImage ||
        !formData.stock
      ) {
        throw new Error("Name, price, category, and main image are required");
      }

      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });
      formDataToSend.append("mainImage", mainImage);
      additionalImages.forEach((image) =>
        formDataToSend.append("additionalImages", image)
      );

      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add product");
      }

      setSuccess("Product added successfully");
      setTimeout(() => router.push("/dashboard/products"), 1500);
    } catch (error) {
      setError(error.message);
      if (
        error.message.includes("token") ||
        error.message.includes("expired")
      ) {
        setTimeout(() => router.push("/login"), 2000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Add New Product</h1>

      {error && (
        <div className={styles.error}>
          {error}
          {error.includes("token") && (
            <button
              onClick={() => router.push("/login")}
              className={styles.loginButton}
            >
              Login Again
            </button>
          )}
        </div>
      )}

      {success && <div className={styles.success}>{success}</div>}

      <ProductForm
        formData={formData}
        setFormData={setFormData}
        mode="add"
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
    </div>
  );
}

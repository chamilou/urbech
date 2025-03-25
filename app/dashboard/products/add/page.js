"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import styles from "./add.module.css";

export default function AddProductPage() {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    categoryId: "",
  });
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
      // 1. Get the current token
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Please login first");
      }

      // 2. Validate form data
      if (!formData.name || !formData.price || !formData.categoryId) {
        throw new Error("Name, price, and category are required");
      }

      const priceValue = parseFloat(formData.price);
      if (isNaN(priceValue)) {
        throw new Error("Price must be a valid number");
      }

      // 3. Make the API request
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          price: priceValue,
          description: formData.description,
          categoryId: formData.categoryId,
        }),
      });

      // 4. Handle response
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add product");
      }

      // 5. Success case
      setSuccess("Product added successfully");
      setTimeout(() => router.push("/dashboard/products"), 1500);
    } catch (error) {
      setError(error.message);

      // Special handling for token expiration
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Add Product</h1>

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

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="name" className={styles.label}>
            Product Name*
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={styles.input}
            required
            disabled={isLoading}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="price" className={styles.label}>
            Price*
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className={styles.input}
            min="0.01"
            step="0.01"
            required
            disabled={isLoading}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description" className={styles.label}>
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={styles.textarea}
            rows="4"
            disabled={isLoading}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="categoryId" className={styles.label}>
            Category*
          </label>
          <select
            id="categoryId"
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            className={styles.input}
            required
            disabled={isLoading || categories.length === 0}
          >
            <option value="">
              {categories.length === 0
                ? "Loading categories..."
                : "Select a category"}
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Or Create New Category</label>
          <div className={styles.categoryCreation}>
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className={styles.input}
              placeholder="New category name"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={handleAddCategory}
              className={styles.secondaryButton}
              disabled={!newCategory.trim() || isLoading}
            >
              {isLoading ? "Adding..." : "Add Category"}
            </button>
          </div>
        </div>

        <div className={styles.buttonGroup}>
          <button
            type="button"
            onClick={() => router.push("/dashboard/products")}
            className={styles.cancelButton}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={styles.primaryButton}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Add Product"}
          </button>
        </div>
      </form>
    </div>
  );
}

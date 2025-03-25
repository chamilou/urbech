"use client";
import { useEffect, useState } from "react";
import styles from "./AddProduct.module.css";

export default function AddProductPage() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [newCategory, setNewCategory] = useState("");
  // Fetch categories from API
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch("/api/categories");
        console.log("Response:", response); // Debug: Log the response
        const data = await response.json();
        console.log("Categories:", data); // Debug: Log the fetched data
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("Failed to fetch categories");
      }
    }
    fetchCategories();
  }, []);
  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newCategory }),
      });
      const data = await response.json();
      console.log("Created category:", data);
      setCategories([...categories, data]); // Update the categories list
      setNewCategory(""); // Clear the input
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, price, description, categoryId }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Product added successfully");
        setName("");
        setPrice("");
        setDescription("");
        setCategoryId("");
      } else {
        setError(data.message || "Failed to add product");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className={styles.container}>
      <h1>Add Product</h1>
      {error && <p className={styles.error}>{error}</p>}
      {success && <p className={styles.success}>{success}</p>}
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="price">Price</label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="categoryId">Category</label>
          <select
            id="categoryId"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
            disabled={categories.length === 0}
          >
            <option value="">
              {categories.length === 0
                ? "No categories available"
                : "Select a category"}
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className={styles.button}>
          Add Product
        </button>
      </form>
      <p>If no Category please add new category below</p>
      <form onSubmit={handleAddCategory} className={styles.form}>
        <div className={styles.formGroup}>
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="New category name"
          />
          <button type="submit" className={styles.button}>
            Add Category
          </button>
        </div>
      </form>
    </div>
  );
}

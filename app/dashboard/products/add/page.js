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

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMainImage(file);
      setMainImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAdditionalImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setAdditionalImages(files);
      setAdditionalPreviews(files.map((file) => URL.createObjectURL(file)));
    }
  };

  const removeAdditionalImage = (index) => {
    const newImages = [...additionalImages];
    const newPreviews = [...additionalPreviews];

    newImages.splice(index, 1);
    newPreviews.splice(index, 1);

    setAdditionalImages(newImages);
    setAdditionalPreviews(newPreviews);
  };

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
      // Validate required fields
      if (
        !formData.name ||
        !formData.price ||
        !formData.categoryId ||
        !mainImage ||
        !formData.stock
      ) {
        throw new Error("Name, price, category, and main image are required");
      }

      // Create form data for file upload
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("description", formData.description || "");
      formDataToSend.append("categoryId", formData.categoryId);
      formDataToSend.append("stock", formData.stock);
      formDataToSend.append("minStock", formData.minStock);
      formDataToSend.append("pricePerUnit", formData.pricePerUnit || "");
      formDataToSend.append("articleNumber", formData.articleNumber || "");
      formDataToSend.append("weight", formData.weight || "");
      formDataToSend.append("length", formData.length || "");
      formDataToSend.append("width", formData.width || "");
      formDataToSend.append("height", formData.height || "");
      formDataToSend.append("color", formData.color || "");
      formDataToSend.append("isTopProduct", formData.isTopProduct.toString());
      formDataToSend.append("isNewProduct", formData.isNewProduct.toString());
      formDataToSend.append("mainImage", mainImage);

      // Append additional images
      additionalImages.forEach((image) => {
        formDataToSend.append("additionalImages", image);
      });

      // Make the API request
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
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

      <form
        onSubmit={handleSubmit}
        className={styles.form}
        encType="multipart/form-data"
      >
        {/* Basic Information Section */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Basic Information</h2>

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
            <div className={styles.inputWithSymbol}>
              <span className={styles.currencySymbol}>$</span>
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
        </div>

        {/* Inventory Section */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Inventory</h2>

          <div className={styles.formGroup}>
            <label htmlFor="stock" className={styles.label}>
              Stock Quantity*
            </label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className={styles.input}
              min="0"
              required
              disabled={isLoading}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="minStock" className={styles.label}>
              Minimum Stock Alert*
            </label>
            <input
              type="number"
              id="minStock"
              name="minStock"
              value={formData.minStock}
              onChange={handleChange}
              className={styles.input}
              min="0"
              required
              disabled={isLoading}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="articleNumber" className={styles.label}>
              Article Number/SKU
            </label>
            <input
              type="text"
              id="articleNumber"
              name="articleNumber"
              value={formData.articleNumber}
              onChange={handleChange}
              className={styles.input}
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Physical Attributes Section */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Physical Attributes</h2>

          <div className={styles.formGroup}>
            <label htmlFor="weight" className={styles.label}>
              Weight (grams)
            </label>
            <input
              type="number"
              id="weight"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              className={styles.input}
              min="0"
              step="1"
              disabled={isLoading}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="dimensions" className={styles.label}>
              Dimensions (cm)
            </label>
            <div className={styles.dimensionsGroup}>
              <input
                type="number"
                id="length"
                name="length"
                value={formData.length}
                onChange={handleChange}
                className={styles.dimensionInput}
                placeholder="Length"
                min="0"
                step="0.1"
                disabled={isLoading}
              />
              <span className={styles.dimensionSeparator}>×</span>
              <input
                type="number"
                id="width"
                name="width"
                value={formData.width}
                onChange={handleChange}
                className={styles.dimensionInput}
                placeholder="Width"
                min="0"
                step="0.1"
                disabled={isLoading}
              />
              <span className={styles.dimensionSeparator}>×</span>
              <input
                type="number"
                id="height"
                name="height"
                value={formData.height}
                onChange={handleChange}
                className={styles.dimensionInput}
                placeholder="Height"
                min="0"
                step="0.1"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="color" className={styles.label}>
              Color
            </label>
            <input
              type="text"
              id="color"
              name="color"
              value={formData.color}
              onChange={handleChange}
              className={styles.input}
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Images Section */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Images</h2>

          <div className={styles.formGroup}>
            <label htmlFor="mainImage" className={styles.label}>
              Main Product Image*
            </label>
            <input
              type="file"
              id="mainImage"
              name="mainImage"
              onChange={handleMainImageChange}
              accept="image/*"
              required
              disabled={isLoading}
            />
            {mainImagePreview && (
              <div className={styles.imagePreviewContainer}>
                <img
                  src={mainImagePreview}
                  alt="Main product preview"
                  className={styles.imagePreview}
                />
                <span className={styles.imageLabel}>Main Image</span>
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="additionalImages" className={styles.label}>
              Additional Images
            </label>
            <input
              type="file"
              id="additionalImages"
              name="additionalImages"
              onChange={handleAdditionalImagesChange}
              accept="image/*"
              multiple
              disabled={isLoading}
            />
            <div className={styles.additionalPreviews}>
              {additionalPreviews.map((preview, index) => (
                <div key={index} className={styles.imagePreviewContainer}>
                  <img
                    src={preview}
                    alt={`Additional preview ${index + 1}`}
                    className={styles.imagePreview}
                  />
                  <span className={styles.imageLabel}>Image {index + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeAdditionalImage(index)}
                    className={styles.removeImageButton}
                    disabled={isLoading}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Product Flags Section */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Product Flags</h2>

          <div className={styles.checkboxGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="isTopProduct"
                checked={formData.isTopProduct}
                onChange={handleCheckboxChange}
                className={styles.checkbox}
                disabled={isLoading}
              />
              <span>Top Product</span>
            </label>

            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="isNewProduct"
                checked={formData.isNewProduct}
                onChange={handleCheckboxChange}
                className={styles.checkbox}
                disabled={isLoading}
              />
              <span>New Product</span>
            </label>
          </div>
        </div>

        {/* Category Section */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Category</h2>

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
        </div>

        {/* Form Actions */}
        <div className={styles.formActions}>
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
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className={styles.buttonLoading}>Processing...</span>
            ) : (
              "Add Product"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

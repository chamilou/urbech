"use client";
import { useRouter } from "next/navigation";
import styles from "./ProductForm.module.css";

export default function ProductForm({
  formData,
  setFormData,
  onSubmit,
  mode = "add",
  mainImage,
  setMainImage,
  mainImagePreview,
  setMainImagePreview,
  additionalImages,
  setAdditionalImages,
  additionalPreviews,
  setAdditionalPreviews,
  newCategory,
  setNewCategory,
  handleAddCategory,
  categories,
  isLoading,
}) {
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

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
    const updatedImages = [...additionalImages];
    const updatedPreviews = [...additionalPreviews];
    updatedImages.splice(index, 1);
    updatedPreviews.splice(index, 1);
    setAdditionalImages(updatedImages);
    setAdditionalPreviews(updatedPreviews);
  };

  return (
    <form
      onSubmit={onSubmit}
      className={styles.form}
      encType="multipart/form-data"
    >
      {/* Basic Info */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Basic Info</h2>

        <div className={styles.formGroup}>
          <label htmlFor="name" className={styles.label}>
            Product Name*
          </label>
          <input
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
            id="price"
            name="price"
            type="number"
            min="0"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            className={styles.input}
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
            rows="4"
            value={formData.description}
            onChange={handleChange}
            className={styles.textarea}
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Inventory */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Inventory</h2>

        <div className={styles.formGroup}>
          <label htmlFor="stock" className={styles.label}>
            Stock*
          </label>
          <input
            id="stock"
            name="stock"
            type="number"
            min="0"
            value={formData.stock}
            onChange={handleChange}
            className={styles.input}
            required
            disabled={isLoading}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="minStock" className={styles.label}>
            Min Stock Alert*
          </label>
          <input
            id="minStock"
            name="minStock"
            type="number"
            min="0"
            value={formData.minStock}
            onChange={handleChange}
            className={styles.input}
            required
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Physical Attributes */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Physical Attributes</h2>

        <div className={styles.formGroup}>
          <label className={styles.label}>Dimensions (L × W × H cm)</label>
          <div className={styles.dimensionsGroup}>
            <input
              name="length"
              type="number"
              placeholder="Length"
              value={formData.length || ""}
              onChange={handleChange}
              className={styles.dimensionInput}
              disabled={isLoading}
            />
            <span>×</span>
            <input
              name="width"
              type="number"
              placeholder="Width"
              value={formData.width || ""}
              onChange={handleChange}
              className={styles.dimensionInput}
              disabled={isLoading}
            />
            <span>×</span>
            <input
              name="height"
              type="number"
              placeholder="Height"
              value={formData.height || ""}
              onChange={handleChange}
              className={styles.dimensionInput}
              disabled={isLoading}
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="weight" className={styles.label}>
            Weight (g)
          </label>
          <input
            id="weight"
            name="weight"
            type="number"
            min="0"
            value={formData.weight || ""}
            onChange={handleChange}
            className={styles.input}
            disabled={isLoading}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="color" className={styles.label}>
            Color
          </label>
          <input
            id="color"
            name="color"
            value={formData.color}
            onChange={handleChange}
            className={styles.input}
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Images */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Images</h2>

        <div className={styles.formGroup}>
          <label htmlFor="mainImage" className={styles.label}>
            Main Image*
          </label>
          <input
            id="mainImage"
            name="mainImage"
            type="file"
            accept="image/*"
            onChange={handleMainImageChange}
            required={mode === "add"}
            disabled={isLoading}
          />
          {mainImagePreview && (
            <div className={styles.imagePreviewContainer}>
              <img
                src={mainImagePreview}
                alt="Main Preview"
                className={styles.imagePreview}
              />
            </div>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="additionalImages" className={styles.label}>
            Additional Images
          </label>
          <input
            id="additionalImages"
            name="additionalImages"
            type="file"
            accept="image/*"
            multiple
            onChange={handleAdditionalImagesChange}
            disabled={isLoading}
          />
          <div className={styles.additionalPreviews}>
            {additionalPreviews.map((preview, index) => (
              <div key={index} className={styles.imagePreviewContainer}>
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className={styles.imagePreview}
                />
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

      {/* Flags */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Product Flags</h2>

        <div className={styles.checkboxGroup}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              name="isTopProduct"
              checked={formData.isTopProduct}
              onChange={handleCheckboxChange}
              disabled={isLoading}
            />
            Top Product
          </label>

          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              name="isNewProduct"
              checked={formData.isNewProduct}
              onChange={handleCheckboxChange}
              disabled={isLoading}
            />
            New Product
          </label>
        </div>
      </div>

      {/* Category */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Category</h2>

        <div className={styles.formGroup}>
          <label htmlFor="categoryId" className={styles.label}>
            Select Category*
          </label>
          <select
            id="categoryId"
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            className={styles.input}
            required
            disabled={isLoading}
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Or Add New</label>
          <div className={styles.categoryCreation}>
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="New category name"
              className={styles.input}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={handleAddCategory}
              className={styles.secondaryButton}
              disabled={!newCategory.trim() || isLoading}
            >
              Add Category
            </button>
          </div>
        </div>
      </div>

      {/* Submit/Cancel */}
      <div className={styles.formActions}>
        <button
          type="button"
          className={styles.cancelButton}
          onClick={() => router.push("/dashboard/products")}
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={styles.submitButton}
          disabled={isLoading}
        >
          {isLoading
            ? "Processing..."
            : mode === "edit"
            ? "Update Product"
            : "Add Product"}
        </button>
      </div>
    </form>
  );
}

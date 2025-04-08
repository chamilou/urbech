"use client";

import { useEffect, useState } from "react";
import styles from "./Profile.module.css";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    city: "",
    zip: "",
    address: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [orders, setOrders] = useState([]);

  // Fetch initial profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");

        if (!token) {
          router.push("/login");
          return;
        }

        const response = await fetch("/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data = await response.json();
        setFormData({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          country: data.country || "",
          city: data.city || "",
          address: data.address?.street || "",
          zip: data.address?.zip || "",
        });
        setOrders(data.orders || []);
      } catch (err) {
        console.error("Profile fetch error:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(""); // Clear errors on change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Update failed");
      }

      setSuccessMessage("Profile updated successfully!");
      setEditMode(false);

      // Refresh the page to get updated data
      router.refresh();
    } catch (err) {
      console.error("Update error:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className={styles.loading}>Loading profile...</div>;
  }

  if (error && !editMode) {
    return (
      <div className={styles.error}>
        <p>{error}</p>
        <button onClick={() => setEditMode(true)}>Try Again</button>
      </div>
    );
  }

  return (
    <div className={styles.profileContainer}>
      <h1>My Profile</h1>

      {successMessage && <div className={styles.success}>{successMessage}</div>}

      {!editMode ? (
        <div className={styles.profileList}>
          <div className={styles.profileField}>
            <span className={styles.label}>Name:</span>
            <span>{formData.name}</span>
          </div>
          <div className={styles.profileField}>
            <span className={styles.label}>Email:</span>
            <span>{formData.email}</span>
          </div>
          <div className={styles.profileField}>
            <span className={styles.label}>Phone:</span>
            <span>{formData.phone || "Not provided"}</span>
          </div>
          <div className={styles.profileField}>
            <span className={styles.label}>Address:</span>
            <span>
              {formData.address
                ? `${formData.zip},${formData.address}, ${formData.city}, ${formData.country}`
                : "Not provided"}
            </span>
          </div>

          <button
            className={styles.editButton}
            onClick={() => setEditMode(true)}
            disabled={isLoading}
          >
            Edit Profile
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className={styles.profileForm}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled // Typically don't allow email changes
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="phone">Phone Number</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="country">Country</label>
            <input
              id="country"
              name="country"
              type="text"
              value={formData.country}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="city">City</label>
            <input
              id="city"
              name="city"
              type="text"
              value={formData.city}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="zip">Zip/Index</label>
            <input
              id="zip"
              name="zip"
              type="text"
              value={formData.zip}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="address">Street Address</label>
            <input
              id="address"
              name="address"
              type="text"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          {error && <div className={styles.formError}>{error}</div>}

          <div className={styles.formActions}>
            <button
              type="button"
              onClick={() => setEditMode(false)}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      )}
      {orders.length > 0 ? (
        <div className={styles.ordersSection}>
          <h2>Order History</h2>
          <ul className={styles.orderList}>
            {orders.map((order) => (
              <li key={order.id} className={styles.orderItem}>
                <strong>Order #{order.orderNumber}</strong> -{" "}
                {new Date(order.createdAt).toLocaleDateString()}
                <ul className={styles.orderItems}>
                  {order.items.map((item) => (
                    <li key={item.id}>
                      {item.product.name} x {item.quantity} — ${item.price}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No order history available.</p>
      )}
    </div>
  );
}

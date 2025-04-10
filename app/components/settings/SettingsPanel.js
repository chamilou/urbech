import { useEffect, useState } from "react";
import styles from "./panel.module.css";

export default function Panel({ active }) {
  const [form, setForm] = useState({
    headerTitle: "",
    footerNote: "",
    bankDetails: "",
    contactInfo: "",
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (active === "pdf") {
      const fetchConfig = async () => {
        setLoading(true);
        const res = await fetch("/api/partner-config");
        const data = await res.json();
        if (res.ok && data) {
          setForm({
            headerTitle: data.headerTitle || "",
            footerNote: data.footerNote || "",
            bankDetails: data.bankDetails || "",
            contactInfo: data.contactInfo || "",
          });
        }
        setLoading(false);
      };

      fetchConfig();
    }
  }, [active]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/partner-config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) alert("Saved!");
    else alert("Failed to save PDF config.");
  };

  if (active === "pdf") {
    return (
      <div className={styles.panel}>
        <h2>PDF Layout Settings</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <form onSubmit={handleSave}>
            <label>Header Title</label>
            <input
              name="headerTitle"
              type="text"
              value={form.headerTitle}
              onChange={handleChange}
            />

            <label>Footer Note</label>
            <input
              name="footerNote"
              type="text"
              value={form.footerNote}
              onChange={handleChange}
            />

            <label>Bank Details</label>
            <textarea
              name="bankDetails"
              value={form.bankDetails}
              onChange={handleChange}
            />

            <label>Contact Info</label>
            <textarea
              name="contactInfo"
              value={form.contactInfo}
              onChange={handleChange}
            />

            <button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Settings"}
            </button>
          </form>
        )}
      </div>
    );
  }

  // ... other tabs (colors, email, etc.)
  return <div className={styles.panel}>Choose a setting from the sidebar</div>;
}

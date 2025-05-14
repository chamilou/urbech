// import { useEffect, useState } from "react";
// import styles from "./panel.module.css";

// export default function Panel({ active }) {
//   const [form, setForm] = useState({
//     headerTitle: "",
//     footerNote: "",
//     bankDetails: "",
//     contactInfo: "",
//   });

//   const [loading, setLoading] = useState(false);
//   const [saving, setSaving] = useState(false);

//   useEffect(() => {
//     if (active === "pdf") {
//       const fetchConfig = async () => {
//         setLoading(true);
//         const res = await fetch("/api/partner-config");
//         const data = await res.json();
//         if (res.ok && data) {
//           setForm({
//             headerTitle: data.headerTitle || "",
//             footerNote: data.footerNote || "",
//             bankDetails: data.bankDetails || "",
//             contactInfo: data.contactInfo || "",
//           });
//         }
//         setLoading(false);
//       };

//       fetchConfig();
//     }
//   }, [active]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSave = async (e) => {
//     e.preventDefault();
//     setSaving(true);
//     const res = await fetch("/api/partner-config", {

//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(form),
//     });
//     setSaving(false);
//     if (res.ok) alert("Saved!");
//     else alert("Failed to save PDF config.");
//   };

//   if (active === "pdf") {
//     return (
//       <div className={styles.panel}>
//         <h2>PDF Layout Settings</h2>
//         {loading ? (
//           <p>Loading...</p>
//         ) : (
//           <form onSubmit={handleSave}>
//             <label>Header Title</label>
//             <input
//               name="headerTitle"
//               type="text"
//               value={form.headerTitle}
//               onChange={handleChange}
//             />

//             <label>Footer Note</label>
//             <input
//               name="footerNote"
//               type="text"
//               value={form.footerNote}
//               onChange={handleChange}
//             />

//             <label>Bank Details</label>
//             <textarea
//               name="bankDetails"
//               value={form.bankDetails}
//               onChange={handleChange}
//             />

//             <label>Contact Info</label>
//             <textarea
//               name="contactInfo"
//               value={form.contactInfo}
//               onChange={handleChange}
//             />

//             <button type="submit" disabled={saving}>
//               {saving ? "Saving..." : "Save Settings"}
//             </button>
//           </form>
//         )}
//       </div>
//     );
//   }

//   // ... other tabs (colors, email, etc.)
//   return <div className={styles.panel}>Choose a setting from the sidebar</div>;
// }
// import { useEffect, useState } from "react";
// import styles from "./panel.module.css";
// import { toast } from "react-hot-toast";

// export default function Panel({ active }) {
//   const [form, setForm] = useState({
//     name: "",
//     type: "",
//     headerTitle: "",
//     footerNote: "",
//     bankDetails: "",
//     contactInfo: ""
//   });

//   const [loading, setLoading] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [validationErrors, setValidationErrors] = useState({});

//   useEffect(() => {
//     if (active === "pdf") {
//       const fetchConfig = async () => {
//         try {
//           setLoading(true);
//           const res = await fetch("/api/partner-config");
          
//           if (!res.ok) throw new Error("Failed to load config");
          
//           const data = await res.json();
//           setForm({
//             name: data.name || "",
//             type: data.type || "",
//             headerTitle: data.headerTitle || "",
//             footerNote: data.footerNote || "",
//             bankDetails: data.bankDetails || "",
//             contactInfo: data.contactInfo || ""
//           });
//         } catch (error) {
//           toast.error(error.message);
//         } finally {
//           setLoading(false);
//         }
//       };

//       fetchConfig();
//     }
//   }, [active]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm(prev => ({ ...prev, [name]: value }));
//     // Clear error when user types
//     if (validationErrors[name]) {
//       setValidationErrors(prev => ({ ...prev, [name]: undefined }));
//     }
//   };

//   const handleSave = async (e) => {
//     e.preventDefault();
    
//     try {
//       setSaving(true);
//       const res = await fetch("/api/partner-config", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(form),
//       });

//       const responseData = await res.json();
      
//       if (!res.ok) {
//         if (responseData.details) {
//           setValidationErrors(responseData.details);
//         }
//         throw new Error(responseData.error || "Failed to save config");
//       }
      
//       toast.success("Settings saved successfully!");
//       setValidationErrors({});
//     } catch (error) {
//       toast.error(error.message);
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (active !== "pdf") {
//     return <div className={styles.panel}>Choose a setting from the sidebar</div>;
//   }


//   return (
//     <div className={styles.panel}>
//       <h2>PDF Layout Settings</h2>
//       {loading ? (
//         <div className={styles.loader}>Loading settings...</div>
//       ) : (
//         <form onSubmit={handleSave} className={styles.form}>
//           <div className={styles.formGroup}>
//             <label>Partner Name *</label>
//             <input
//               name="name"
//               type="text"
//               value={form.name}
//               onChange={handleChange}
//               required
//               maxLength={100}
//             />
//             {validationErrors?.name && (
//               <p className={styles.error}>{validationErrors.name}</p>
//             )}
//           </div>

//           <div className={styles.formGroup}>
//             <label>Partner Type *</label>
//             <input
//               name="type"
//               type="text"
//               value={form.type}
//               onChange={handleChange}
//               required
//               maxLength={50}
//             />
//             {validationErrors?.type && (
//               <p className={styles.error}>{validationErrors.type}</p>
//             )}
//           </div>
//           <div className={styles.formGroup}>
//             <label>Footer Note</label>
//             <input
//               name="footerNote"
//               type="text"
//               value={form.footerNote}
//               onChange={handleChange}
//               maxLength={200}
//             />
//           </div>

//           <div className={styles.formGroup}>
//             <label>Bank Details</label>
//             <textarea
//               name="bankDetails"
//               value={form.bankDetails}
//               onChange={handleChange}
//               rows={4}
//               maxLength={500}
//             />
//           </div>

//           <div className={styles.formGroup}>
//             <label>Contact Info</label>
//             <textarea
//               name="contactInfo"
//               value={form.contactInfo}
//               onChange={handleChange}
//               rows={4}
//               maxLength={500}
//             />
//           </div>
//           <button 
//             type="submit" 
//             disabled={saving}
//             className={styles.saveButton}
//           >
//             {saving ? "Saving..." : "Save Settings"}
//           </button>
//         </form>
//       )}
//     </div>
//   );
// }


/////////////////////////////
"use client";
import { useEffect, useState } from "react";
import styles from "./panel.module.css";
import { toast } from "react-hot-toast";

export default function PartnerPanel() {
  const [partners, setPartners] = useState([]);
  const [selectedPartnerId, setSelectedPartnerId] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    type: "SUPPLIER",
    contactName: "",
    phone: "",
    email: "",
    headerTitle: "",
    footerNote: "",
    bankDetails: "",
    contactInfo: "",
    logoUrl: "",
    paymentTerms: "",
    returnPolicy: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch all partners on mount


  useEffect(() => {
    const fetchPartners = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/partners");
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        
        
        // Ensure data is always an array
        const partnerArray = Array.isArray(data) ? data : [];
        setPartners(partnerArray);
        
        if (partnerArray.length > 0) {
          setSelectedPartnerId(partnerArray[0].id);
        }
      } catch (error) {
        console.error("Failed to fetch partners:", error);
        toast.error("Failed to load partners");
        setPartners([]); // Ensure partners stays as array
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
    
  }, []);

  // Load partner details when selection changes
  useEffect(() => {
    if (selectedPartnerId) {
      const fetchPartnerDetails = async () => {
        try {
          setLoading(true);
          const res = await fetch(`/api/partner-config?partnerId=${selectedPartnerId}`);
          const data = await res.json();
          setFormData({
            ...data,
            street: data.address?.street || "",
            city: data.address?.city || "",
            state: data.address?.state || "",
            postalCode: data.address?.postalCode || "",
            country: data.address?.country || ""
          });
        } catch (error) {
          toast.error("Failed to load partner details");
        } finally {
          setLoading(false);
        }
      };
      fetchPartnerDetails();
    }
  }, [selectedPartnerId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await fetch("/api/partner-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          partnerId: selectedPartnerId || undefined,
          ...formData,
          address: {
            street: formData.street,
            city: formData.city,
            state: formData.state,
            postalCode: formData.postalCode,
            country: formData.country
          }
        })
      });
      
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to save");
      
      toast.success("Partner saved successfully!");
      // Refresh partners list if new partner was created
      if (!selectedPartnerId) {
        const refreshRes = await fetch("/api/partners");
        const updatedPartners = await refreshRes.json();
        setPartners(updatedPartners);
        setSelectedPartnerId(result.id);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };
  const renderPartnerOptions = () => {
    if (loading) {
      return <option value="">Loading partners...</option>;
    }
    
    if (partners.length === 0) {
      return <option value="">No partners found</option>;
    }
    
    return (
      <>
        <option value="">-- Create New Partner --</option>
        {partners.map(partner => (
          <option key={partner.id} value={partner.id}>
            {partner.name} ({partner.type.toLowerCase()})
          </option>
        ))}
      </>
    );
  };
  return (
    <div className={styles.panel}>
      <h2>Partner Management</h2>
      
      <div className={styles.partnerSelector}>
        <select
          value={selectedPartnerId}
          onChange={(e) => setSelectedPartnerId(e.target.value)}
          disabled={loading}
        >
          {renderPartnerOptions()}
        </select>
        <button 
          onClick={() => setSelectedPartnerId("")}
          className={styles.newButton}
        >
          + New Partner
        </button>
      </div>

      <form onSubmit={handleSave}>
        <div className={styles.section}>
          <h3>Basic Information</h3>
          <div className={styles.formGroup}>
            <label>Partner Name *</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label>Partner Type *</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="SUPPLIER">Supplier</option>
              <option value="DISTRIBUTOR">Distributor</option>
              <option value="RETAILER">Retailer</option>
              <option value="CUSTOMER">Customer</option>
            </select>
          </div>
        </div>

        <div className={styles.section}>
          <h3>Contact Information</h3>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Contact Person</label>
              <input
                name="contactName"
                value={formData.contactName}
                onChange={handleChange}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Phone</label>
              <input
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className={styles.formGroup}>
            <label>Email</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className={styles.section}>
          <h3>Address</h3>
          <div className={styles.formGroup}>
            <label>Street</label>
            <input
              name="street"
              value={formData.street}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>City</label>
              <input
                name="city"
                value={formData.city}
                onChange={handleChange}
              />
            </div>
            <div className={styles.formGroup}>
              <label>State/Province</label>
              <input
                name="state"
                value={formData.state}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Postal Code</label>
              <input
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Country</label>
              <input
                name="country"
                value={formData.country}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h3>Invoice Settings</h3>
          <div className={styles.formGroup}>
            <label>Header Title</label>
            <input
              name="headerTitle"
              value={formData.headerTitle}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Logo URL</label>
            <input
              name="logoUrl"
              type="url"
              value={formData.logoUrl}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Bank Details</label>
            <textarea
              name="bankDetails"
              value={formData.bankDetails}
              onChange={handleChange}
              rows={4}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Payment Terms</label>
            <textarea
              name="paymentTerms"
              value={formData.paymentTerms}
              onChange={handleChange}
              rows={2}
            />
          </div>
        </div>

        <div className={styles.formActions}>
          <button type="submit" disabled={saving || loading}>
            {saving ? "Saving..." : "Save Partner"}
          </button>
        </div>
      </form>
    </div>
  );
}

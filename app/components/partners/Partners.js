//card type
// "use client";

// import styles from "./Partners.module.css";
// import { useEffect, useState } from "react";

// export default function Partners() {
//   const [partners, setPartners] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showForm, setShowForm] = useState(false);
//   const [formData, setFormData] = useState({
//     name: "",
//     type: "SUPPLIER",
//     phone: "",
//     email: "",
//     street: "",
//     city: "",
//     country: "",
//     zip: "",
//   });

//   const fetchPartners = async () => {
//     setLoading(true);
//     const res = await fetch("/api/partners");
//     const data = await res.json();
//     setPartners(data.partners || []);
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchPartners();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const res = await fetch("/api/partners", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(formData),
//     });

//     if (res.ok) {
//       setFormData({
//         name: "",
//         type: "SUPPLIER",
//         phone: "",
//         email: "",
//         street: "",
//         city: "",
//         country: "",
//         zip: "",
//       });
//       setShowForm(false);
//       fetchPartners(); // refresh
//     } else {
//       alert("Failed to add partner.");
//     }
//   };

//   return (
//     <div className={styles.wrapper}>
//       <div className={styles.headerRow}>
//         <h2>Partner Management</h2>
//         <button
//           className={styles.addButton}
//           onClick={() => setShowForm(!showForm)}
//         >
//           {showForm ? "Cancel" : "+ Add Partner"}
//         </button>
//       </div>

//       {showForm && (
//         <form onSubmit={handleSubmit} className={styles.form}>
//           <input
//             type="text"
//             placeholder="Name"
//             required
//             value={formData.name}
//             onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//           />
//           <select
//             value={formData.type}
//             onChange={(e) => setFormData({ ...formData, type: e.target.value })}
//           >
//             <option value="SUPPLIER">Supplier</option>
//             <option value="DELIVERY">Delivery</option>
//             <option value="PICKUP_POINT">Pickup Point</option>
//           </select>
//           <input
//             type="text"
//             placeholder="Phone"
//             value={formData.phone}
//             onChange={(e) =>
//               setFormData({ ...formData, phone: e.target.value })
//             }
//           />
//           <input
//             type="email"
//             placeholder="Email"
//             value={formData.email}
//             onChange={(e) =>
//               setFormData({ ...formData, email: e.target.value })
//             }
//           />
//           <input
//             type="text"
//             placeholder="Street"
//             value={formData.street}
//             onChange={(e) =>
//               setFormData({ ...formData, street: e.target.value })
//             }
//           />
//           <input
//             type="text"
//             placeholder="City"
//             value={formData.city}
//             onChange={(e) => setFormData({ ...formData, city: e.target.value })}
//           />
//           <input
//             type="text"
//             placeholder="ZIP Code"
//             value={formData.zip}
//             onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
//           />
//           <input
//             type="text"
//             placeholder="Country"
//             value={formData.country}
//             onChange={(e) =>
//               setFormData({ ...formData, country: e.target.value })
//             }
//           />
//           <button type="submit" className={styles.submitButton}>
//             Create Partner
//           </button>
//         </form>
//       )}

//       <div className={styles.container}>
//         {partners.map((partner) => (
//           <div key={partner.id} className={styles.card}>
//             <div className={styles.cardHeader}>{partner.name}</div>
//             <div className={styles.infoGroup}>
//               <div>
//                 <strong>Type:</strong> {partner.type}
//               </div>
//               <div>
//                 <strong>Phone:</strong> {partner.phone || "-"}
//               </div>
//               <div>
//                 <strong>Email:</strong> {partner.email || "-"}
//               </div>
//               <div>
//                 <strong>City:</strong> {partner.address?.city || "-"}
//               </div>
//             </div>
//             <div className={styles.meta}>
//               Created: {new Date(partner.createdAt).toLocaleDateString()}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
//table type
"use client";

import styles from "./Partners.module.css";
import { useEffect, useState } from "react";

export default function Partners() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    type: "SUPPLIER",
    phone: "",
    email: "",
    street: "",
    city: "",
    country: "",
    zip: "",
  });

  const fetchPartners = async () => {
    setLoading(true);
    const res = await fetch("/api/partners");
    const data = await res.json();
    setPartners(data.partners || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/partners", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      setFormData({
        name: "",
        type: "SUPPLIER",
        phone: "",
        email: "",
        street: "",
        city: "",
        country: "",
        zip: "",
      });
      setShowForm(false);
      fetchPartners();
    } else {
      alert("Failed to create partner.");
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.headerRow}>
        <h2>Partner Management</h2>
        <button
          className={styles.addButton}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "+ Add Partner"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            placeholder="Name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          >
            <option value="SUPPLIER">Supplier</option>
            <option value="DELIVERY">Delivery</option>
            <option value="PICKUP_POINT">Pickup Point</option>
          </select>
          <input
            type="text"
            placeholder="Phone"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Street"
            value={formData.street}
            onChange={(e) =>
              setFormData({ ...formData, street: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="City"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          />
          <input
            type="text"
            placeholder="ZIP Code"
            value={formData.zip}
            onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
          />
          <input
            type="text"
            placeholder="Country"
            value={formData.country}
            onChange={(e) =>
              setFormData({ ...formData, country: e.target.value })
            }
          />
          <button type="submit" className={styles.submitButton}>
            Create Partner
          </button>
        </form>
      )}

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Phone</th>
            <th>Email</th>
            <th>City</th>
            <th>Created</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {partners.map((partner) => (
            <tr key={partner.id}>
              <td>{partner.name}</td>
              <td>{partner.type}</td>
              <td>{partner.phone || "-"}</td>
              <td>{partner.email || "-"}</td>
              <td>{partner.address?.city || "-"}</td>
              <td>{new Date(partner.createdAt).toLocaleDateString()}</td>
              <td>
                <button
                  className={styles.editButton}
                  onClick={() => setEditingId(partner.id)}
                >
                  ✏️ Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

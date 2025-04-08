import styles from "./sidebar.module.css";

export default function Sidebar({ active, setActive }) {
  const tabs = [
    { id: "pdf", label: "PDF Layout" },
    { id: "colors", label: "Color Scheme" },
    { id: "email", label: "Email" },
    { id: "newsletter", label: "Newsletter" },
  ];

  return (
    <div className={styles.sidebar}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActive(tab.id)}
          className={active === tab.id ? styles.active : ""}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

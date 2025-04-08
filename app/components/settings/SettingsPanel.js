import styles from "./panel.module.css";

export default function Panel({ active }) {
  if (active === "pdf") {
    return (
      <div className={styles.panel}>
        <h2>PDF Layout Settings</h2>
        <form>
          <label>Header Text</label>
          <input type="text" placeholder="Invoice Header" />

          <label>Footer Text</label>
          <input type="text" placeholder="Thanks for your business!" />

          <label>Position</label>
          <select>
            <option>Top Left</option>
            <option>Top Right</option>
            <option>Bottom Left</option>
            <option>Bottom Right</option>
          </select>
        </form>
      </div>
    );
  }

  if (active === "colors") {
    return (
      <div className={styles.panel}>
        <h2>Color Settings</h2>
        <form>
          <label>Primary Color</label>
          <input type="color" />

          <label>Accent Color</label>
          <input type="color" />
        </form>
      </div>
    );
  }

  return <div className={styles.panel}>Choose a setting from the sidebar</div>;
}

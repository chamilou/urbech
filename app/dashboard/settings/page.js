"use client";

import { useState } from "react";
import Sidebar from "@/app/components/settings/SettingsSidebar";
import Panel from "@/app/components/settings/SettingsPanel";
import styles from "./SettingsPage.module.css";
export const dynamic = "force-dynamic";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("pdf");

  return (
    <div className={styles.container}>
      <Sidebar active={activeTab} setActive={setActiveTab} />
      <Panel active={activeTab} />
    </div>
  );
}

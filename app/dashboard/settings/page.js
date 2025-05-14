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
// "use client"
// import { useState } from 'react';
// import Sidebar from '@/app/components/settings/SettingsSidebar';
// import Panel from '@/app/components/settings/SettingsPanel';
// import styles from './SettingsPage.module.css';

// export default function SettingsPage() {
//   const [activeTab, setActiveTab] = useState('partner'); // Default to partner tab

//   return (
//     <div className={styles.settingsContainer}>
//       <Sidebar active={activeTab} setActive={setActiveTab} />
      
//       <div className={styles.contentArea}>
//         {activeTab === 'partner' && <Panel active={activeTab} />}
//         {activeTab === 'pdf' && <PdfSettingsPanel />}
//         {activeTab === 'colors' && <ColorSchemePanel />}
//         {activeTab === 'email' && <EmailTemplatesPanel />}
//         {activeTab === 'newsletter' && <NewsletterPanel />}
//       </div>
//     </div>
//   );
// }

// // Placeholder components for other tabs
// function PdfSettingsPanel() {
//   return <div>PDF Settings Panel</div>;
// }

// function ColorSchemePanel() {
//   return <div>Color Scheme Panel</div>;
// }

// function EmailTemplatesPanel() {
//   return <div>Email Templates Panel</div>;
// }

// function NewsletterPanel() {
//   return <div>Newsletter Panel</div>;
// }
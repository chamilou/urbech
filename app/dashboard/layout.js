// app/dashboard/layout.js
export const dynamic = "force-dynamic";

export default function DashboardLayout({ children }) {
  return (
    <div className="dashboard-layout">
      <main>{children}</main>
    </div>
  );
}

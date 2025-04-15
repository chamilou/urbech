// app/dashboard/layout.js
// export const dynamic = "force-dynamic";

export default function CartLayout({ children }) {
  return (
    <div className="dashboard-layout">
      <main>{children}</main>
    </div>
  );
}

// "use client";

// import Sidebar from "./Sidebar";
// import Header from "./Header";

// export default function AdminLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <div className="flex h-screen bg-gray-100">
//       {/* Sidebar */}
//       <Sidebar />

//       {/* Main Area */}
//       <div className="flex flex-col flex-1">
//         <Header />

//         <main className="flex-1 p-6 overflow-y-auto">{children}</main>
//       </div>
//     </div>
//   );
// }
"use client";

import { useState } from "react";
import AdminHeader from "./Header";
import AdminSidebar from "./Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-slate-100">
      {/* HEADER (Full Width) */}
      <AdminHeader onToggleSidebar={() => setCollapsed(!collapsed)} />

      {/* BODY */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <AdminSidebar collapsed={collapsed} />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}

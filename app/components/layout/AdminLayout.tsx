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

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "./Header";
import AdminSidebar from "./Sidebar";
import {
  clearAdminAuthToken,
  getAdminAuthToken,
  hasAdminSession,
} from "@/app/libs/adminAuth";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const token = getAdminAuthToken();
    if (!hasAdminSession(token)) {
      clearAdminAuthToken();
      router.replace("/login");
      return;
    }

    setCheckingAuth(false);
  }, [router]);

  const handleLogout = () => {
    clearAdminAuthToken();
    router.replace("/login");
  };

  if (checkingAuth) {
    return null;
  }

  return (
    <div className="flex flex-col h-screen bg-slate-100">
      {/* HEADER (Full Width) */}
      <AdminHeader
        onToggleSidebar={() => setCollapsed(!collapsed)}
        onLogout={handleLogout}
      />

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

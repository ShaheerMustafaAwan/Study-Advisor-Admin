// "use client";
// import { Bell, Menu, GraduationCap, LogOut } from "lucide-react";

// interface AdminHeaderProps {
//   onToggleSidebar: () => void;
//   onLogout: () => void;
// }

// export default function AdminHeader({
//   onToggleSidebar,
//   onLogout,
// }: AdminHeaderProps) {
//   return (
//     <header className="w-full bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
//       {/* LEFT SIDE */}
//       <div className="flex items-center gap-4">
//         {/* Collapse Button */}
//         <button
//           onClick={onToggleSidebar}
//           className="p-2 rounded-lg hover:bg-slate-100 transition"
//         >
//           <Menu className="w-5 h-5 text-slate-700" />
//         </button>

//         {/* Logo + Brand */}
//         <div className="flex items-center gap-3">
//           <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm">
//             <GraduationCap className="w-5 h-5 text-white" />
//           </div>

//           <h1 className="text-lg sm:text-xl bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
//             The Study Advisor
//           </h1>
//         </div>
//       </div>

//       {/* RIGHT SIDE */}
//       <div className="flex items-center gap-6">
//         <button
//           onClick={onLogout}
//           className="p-2 rounded-lg hover:bg-slate-100 transition"
//           title="Logout"
//         >
//           <LogOut className="w-5 h-5 text-slate-600" />
//         </button>

//         <button className="relative p-2 rounded-lg hover:bg-slate-100 transition">
//           <Bell className="w-5 h-5 text-slate-600" />
//           <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
//             3
//           </span>
//         </button>

//         <div className="flex items-center gap-3">
//           <div className="w-9 h-9 rounded-full bg-linear-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-center font-medium">
//             S
//           </div>
//           <div className="hidden sm:block">
//             <p className="text-sm font-medium">Shaheer</p>
//             <p className="text-xs text-purple-600">Admin</p>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// }

"use client";
import { useEffect, useState } from "react";
import { Bell, Menu, GraduationCap, LogOut } from "lucide-react";

interface AdminHeaderProps {
  onToggleSidebar: () => void;
  onLogout: () => void;
}

export default function AdminHeader({
  onToggleSidebar,
  onLogout,
}: AdminHeaderProps) {
  const [adminName, setAdminName] = useState("Admin");

  // Fetch dynamic name on mount
  useEffect(() => {
    const storedName = localStorage.getItem("admin_name");
    if (storedName) {
      setAdminName(storedName);
    }
  }, []);

  // Helper to generate initials from name
  const getInitials = (name: string) => {
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 1).toUpperCase();
  };

  return (
    <header className="w-full bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
      {/* LEFT SIDE */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 transition"
        >
          <Menu className="w-5 h-5 text-brand-muted" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-primary flex items-center justify-center shadow-sm">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-brand-heading tracking-tight">
            The Study Advisor
          </h1>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-4 sm:gap-6">
        <button className="relative p-2 rounded-lg hover:bg-gray-100 transition">
          <Bell className="w-5 h-5 text-brand-muted" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>

        <div className="flex items-center gap-3 border-l pl-4 sm:pl-6 border-gray-200">
          <div className="w-9 h-9 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-sm shadow-sm">
            {getInitials(adminName)}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-bold text-brand-heading leading-tight">{adminName}</p>
            <p className="text-[11px] uppercase tracking-wider text-brand-primary font-bold">Admin</p>
          </div>
        </div>

        <button
          onClick={() => {
            localStorage.removeItem("admin_name"); // Clean up name on logout
            onLogout();
          }}
          className="ml-2 p-2 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-600 transition"
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
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
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, Menu, GraduationCap, LogOut } from "lucide-react";
import {
  adminApi,
  AdminNotification,
  formatRelativeTime,
} from "@/app/libs/adminApi";

interface AdminHeaderProps {
  onToggleSidebar: () => void;
  onLogout: () => void;
}

export default function AdminHeader({
  onToggleSidebar,
  onLogout,
}: AdminHeaderProps) {
  const router = useRouter();
  const [adminName, setAdminName] = useState("Admin");
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Fetch dynamic name on mount
  useEffect(() => {
    const storedName = localStorage.getItem("admin_name");
    if (storedName) {
      setAdminName(storedName);
    }
  }, []);

  const loadNotifications = async () => {
    try {
      setLoadingNotifications(true);
      const response = await adminApi.getNotifications({ limit: 20 });
      setNotifications(response.notifications || []);
      setUnreadCount(response.unreadCount || 0);
    } catch (error) {
      console.error("Failed to load admin notifications:", error);
    } finally {
      setLoadingNotifications(false);
    }
  };

  useEffect(() => {
    loadNotifications();

    const interval = window.setInterval(() => {
      loadNotifications();
    }, 20_000);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  const topNotifications = useMemo(
    () => notifications.slice(0, 6),
    [notifications],
  );

  const handleNotificationAction = async (item: AdminNotification) => {
    try {
      if (!item.isRead) {
        await adminApi.markNotificationRead(item.id);
      }

      await loadNotifications();

      if (item.actionPath) {
        setDropdownOpen(false);
        router.push(item.actionPath);
      }
    } catch (error) {
      console.error("Failed to handle notification action:", error);
    }
  };

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
        <div className="relative">
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="relative p-2 rounded-lg hover:bg-gray-100 transition"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-brand-muted" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 bg-red-500 rounded-full border border-white text-white text-[10px] font-bold flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-[360px] max-h-[420px] overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-xl z-50">
              <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                <p className="text-sm font-semibold text-brand-heading">
                  Notifications
                </p>
                <button
                  onClick={loadNotifications}
                  className="text-xs text-brand-primary font-semibold hover:underline"
                >
                  Refresh
                </button>
              </div>

              {loadingNotifications && (
                <p className="px-4 py-4 text-sm text-slate-500">
                  Loading notifications...
                </p>
              )}

              {!loadingNotifications && topNotifications.length === 0 && (
                <p className="px-4 py-4 text-sm text-slate-500">
                  No notifications yet.
                </p>
              )}

              {!loadingNotifications &&
                topNotifications.map((item) => (
                  <div
                    key={item.id}
                    className={`px-4 py-3 border-b border-gray-100 ${
                      item.isRead ? "bg-white" : "bg-blue-50"
                    }`}
                  >
                    <p className="text-sm font-semibold text-brand-heading">
                      {item.title.replace("[CONNECT_REQUEST]", "").trim()}
                    </p>
                    <p className="text-xs text-slate-600 mt-1">
                      {item.message}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      {formatRelativeTime(item.createdAt)}
                    </p>

                    {item.isConnectionRequest && item.actionPath && (
                      <button
                        onClick={() => handleNotificationAction(item)}
                        className="mt-2 px-3 py-1.5 rounded-md bg-brand-primary text-white text-xs font-semibold hover:opacity-90"
                      >
                        Assign Counselor
                      </button>
                    )}
                  </div>
                ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 border-l pl-4 sm:pl-6 border-gray-200">
          <div className="w-9 h-9 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-sm shadow-sm">
            {getInitials(adminName)}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-bold text-brand-heading leading-tight">
              {adminName}
            </p>
            <p className="text-[11px] uppercase tracking-wider text-brand-primary font-bold">
              Admin
            </p>
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

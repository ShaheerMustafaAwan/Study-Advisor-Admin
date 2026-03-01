"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  UserPlus,
  Users,
  School,
  BarChart3,
  Settings,
} from "lucide-react";

interface SidebarProps {
  collapsed: boolean;
}

const menuItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Assign Students", href: "/admin/assign-students", icon: UserPlus },
  { name: "Manage Counselors", href: "/admin/manage-counselors", icon: Users },
  {
    name: "Partner Universities",
    href: "/admin/partner-universities",
    icon: School,
  },
  // { name: "System Overview", href: "/admin/system-overview", icon: BarChart3 },
  { name: "Settings", href: "/admin/general-settings", icon: Settings },
];

export default function AdminSidebar({ collapsed }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`bg-white border-r border-slate-200 transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                active
                  ? "bg-linear-to-r from-blue-600 to-indigo-600 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Icon size={20} />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

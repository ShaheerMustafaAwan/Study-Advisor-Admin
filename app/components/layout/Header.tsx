"use client";
import { Bell, Menu, GraduationCap } from "lucide-react";

interface AdminHeaderProps {
  onToggleSidebar: () => void;
}

export default function AdminHeader({ onToggleSidebar }: AdminHeaderProps) {
  return (
    <header className="w-full bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
      {/* LEFT SIDE */}
      <div className="flex items-center gap-4">
        {/* Collapse Button */}
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg hover:bg-slate-100 transition"
        >
          <Menu className="w-5 h-5 text-slate-700" />
        </button>

        {/* Logo + Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>

          <h1 className="text-lg sm:text-xl bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            The Study Advisor
          </h1>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-6">
        <button className="relative p-2 rounded-lg hover:bg-slate-100 transition">
          <Bell className="w-5 h-5 text-slate-600" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
            3
          </span>
        </button>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-linear-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-center font-medium">
            S
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium">Shaheer</p>
            <p className="text-xs text-purple-600">Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}

"use client";

import { Users, Clock, CheckCircle, UserPlus } from "lucide-react";
import { useAdminStore } from "@/app/store/useAdminStore";
import AdminStatCard from "./AdminStatCard";

export default function StatsOverview() {
  const { counselors, students } = useAdminStore();

  /* ---------- CALCULATIONS ---------- */

  const totalStudents = students.length;

  const assignedStudents = students.filter((s) => s.assigned !== null).length;

  const unassignedStudents = students.filter((s) => s.assigned === null).length;

  const activeCounselors = counselors.length;

  const stats = [
    {
      title: "Total Students",
      value: totalStudents,
      icon: <Users className="w-8 h-8 text-blue-600" />,
      valueColor: "text-blue-600",
    },
    {
      title: "Unassigned",
      value: unassignedStudents,
      icon: <Clock className="w-8 h-8 text-red-500" />,
      valueColor: "text-red-500",
    },
    {
      title: "Assigned",
      value: assignedStudents,
      icon: <CheckCircle className="w-8 h-8 text-green-600" />,
      valueColor: "text-green-600",
    },
    {
      title: "Active Counselors",
      value: activeCounselors,
      icon: <UserPlus className="w-8 h-8 text-purple-600" />,
      valueColor: "text-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <AdminStatCard
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          valueColor={stat.valueColor}
        />
      ))}
    </div>
  );
}

"use client";

import { Users, Clock, CheckCircle, UserPlus } from "lucide-react";
import AdminStatCard from "./AdminStatCard";

type StatsOverviewProps = {
  totalStudents: number;
  assignedStudents: number;
  unassignedStudents: number;
  activeCounselors: number;
};

export default function StatsOverview({
  totalStudents,
  assignedStudents,
  unassignedStudents,
  activeCounselors,
}: StatsOverviewProps) {
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

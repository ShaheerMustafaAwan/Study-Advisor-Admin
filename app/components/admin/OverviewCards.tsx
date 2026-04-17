"use client";

import { Users, FileCheck, FileText, Bell } from "lucide-react";

type OverviewCardsProps = {
  totalStudents: number;
  totalDocuments: number;
  totalSops: number;
  pendingConnections: number;
};

function StatCard({
  title,
  value,
  percentage,
  highlightLabel,
  icon,
  gradient,
}: {
  title: string;
  value: number;
  percentage: number;
  highlightLabel?: string;
  icon: React.ReactNode;
  gradient: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-6 bg-linear-to-br ${gradient} text-white shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
    >
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-2xl" />

      <div className="flex justify-between items-start relative z-10">
        <div>
          <p className="text-sm opacity-80">{title}</p>
          <h2 className="text-3xl font-bold mt-2">{value}</h2>
          <div className="mt-3 inline-flex items-center bg-white/20 px-3 py-1 rounded-full text-xs font-medium">
            {highlightLabel || `↑ ${percentage}% this month`}
          </div>
        </div>

        <div className="bg-white/20 p-3 rounded-xl backdrop-blur-md">
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function OverviewCards({
  totalStudents,
  totalDocuments,
  totalSops,
  pendingConnections,
}: OverviewCardsProps) {
  /* ===== Dummy % Calculation (Replace later with real logic) ===== */
  const getRandomPercent = () => Math.floor(Math.random() * 25) + 5;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Students"
        value={totalStudents}
        percentage={getRandomPercent()}
        icon={<Users />}
        gradient="from-indigo-500 to-purple-600"
      />

      <StatCard
        title="Verified Documents"
        value={totalDocuments}
        percentage={getRandomPercent()}
        icon={<FileCheck />}
        gradient="from-emerald-500 to-teal-600"
      />

      <StatCard
        title="Generated SOPs"
        value={totalSops}
        percentage={getRandomPercent()}
        icon={<FileText />}
        gradient="from-pink-500 to-rose-600"
      />

      <StatCard
        title="Pending Connections"
        value={pendingConnections}
        percentage={0}
        highlightLabel="Needs review"
        icon={<Bell />}
        gradient="from-orange-500 to-red-500"
      />
    </div>
  );
}

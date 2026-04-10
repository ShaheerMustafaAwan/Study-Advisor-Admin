"use client";

type HeroSectionProps = {
  totalStudents: number;
  totalCounselors: number;
  totalUniversities: number;
  totalApplications: number;
};

export default function AdminHero({
  totalStudents,
  totalCounselors,
  totalUniversities,
  totalApplications,
}: HeroSectionProps) {
  return (
    <div className="bg-linear-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 sm:p-8 text-white shadow-md">
      {/* HEADER */}
      <h1 className="text-xl sm:text-2xl font-semibold mb-2">
        Admin Control Panel
      </h1>

      <p className="text-purple-100 mb-8 text-sm sm:text-base">
        Manage the entire Study Advisor platform
      </p>

      {/* STATS GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
        <Stat value={totalStudents} label="Students" />
        <Stat value={totalCounselors} label="Counselors" />
        <Stat value={totalUniversities} label="Universities" />
        <Stat value={totalApplications} label="Applications" />
      </div>
    </div>
  );
}

/* ------------------ SMALL REUSABLE STAT ------------------ */

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl py-5 transition hover:bg-white/20">
      <p className="text-2xl sm:text-3xl font-bold">{value}</p>
      <p className="text-xs sm:text-sm text-purple-100 mt-1">{label}</p>
    </div>
  );
}

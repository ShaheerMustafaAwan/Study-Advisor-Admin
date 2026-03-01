"use client";

import { useState } from "react";
import { useAdminStore } from "@/app/store/useAdminStore";

export default function CounselorCapacity() {
  const { counselors, students } = useAdminStore();

  const getLoad = (name: string) =>
    students.filter((s) => s.assigned === name).length;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Counselor Capacity</h2>
        <p className="text-sm text-slate-500">
          Current workload and availability
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {counselors.map((c) => {
          const load = getLoad(c.name);
          const percentage = (load / c.capacity) * 100;

          return (
            <div key={c.id} className="border border-slate-200 rounded-xl p-4">
              <div className="flex justify-between mb-2">
                <p className="font-medium">{c.name}</p>
                <span className="text-xs bg-slate-100 px-3 py-1 rounded-full">
                  {load}/{c.capacity}
                </span>
              </div>

              <div className="w-full h-2 bg-slate-200 rounded-full mb-3">
                <div
                  className="h-2 bg-blue-600 rounded-full"
                  style={{ width: `${percentage}%` }}
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {c.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="text-xs bg-slate-100 px-3 py-1 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

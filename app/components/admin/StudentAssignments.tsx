"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { useAdminStore } from "@/app/store/useAdminStore";

export default function StudentAssignments() {
  const { counselors, students } = useAdminStore();
  const getLoad = (name: string) =>
    students.filter((s) => s.assigned === name).length;

  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  // ✅ Move Zustand hooks inside component
  // const students = useAdminStore((state) => state.students);
  // const counselors = useAdminStore((state) => state.counselors);
  const assignStudent = useAdminStore((state) => state.assignStudent);

  // 🔎 FILTER + SEARCH
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(search.toLowerCase()) ||
      student.program.toLowerCase().includes(search.toLowerCase()) ||
      student.location.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "All"
        ? true
        : filter === "Assigned"
          ? student.assigned !== null
          : student.assigned === null;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Student Assignments</h2>
        <p className="text-sm text-slate-500">
          Assign students based on specialization and availability
        </p>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative w-full">
          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search students..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-slate-200 rounded-lg px-4 py-2 text-sm"
        >
          <option value="All">All Status</option>
          <option value="Assigned">Assigned</option>
          <option value="Unassigned">Unassigned</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-slate-400 border-b border-slate-100">
            <tr>
              <th className="py-3 font-medium">Student</th>
              <th>Program</th>
              <th>Location</th>
              <th>Date</th>
              <th>Assigned Counselor</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredStudents.map((student) => (
              <tr
                key={student.id}
                className="border-b border-slate-100 hover:bg-slate-50 transition"
              >
                <td className="py-4 font-medium">{student.name}</td>
                <td>{student.program}</td>
                <td>{student.location}</td>
                <td>{student.date}</td>

                <td>
                  {student.assigned ? (
                    <span className="text-green-600 bg-green-50 px-3 py-1 rounded-full text-xs">
                      {student.assigned}
                    </span>
                  ) : (
                    <span className="text-slate-500 bg-slate-100 px-3 py-1 rounded-full text-xs">
                      Unassigned
                    </span>
                  )}
                </td>

                <td>
                  <select
                    onChange={(e) => assignStudent(student.id, e.target.value)}
                    value={student.assigned || ""}
                    className="border border-slate-200 rounded-lg px-3 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="" disabled>
                      {student.assigned ? "Reassign..." : "Assign..."}
                    </option>

                    {counselors.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name} ({1}/{c.capacity})
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredStudents.length === 0 && (
          <div className="text-center py-8 text-slate-400">
            No students found.
          </div>
        )}
      </div>
    </div>
  );
}

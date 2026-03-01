"use client";

import { useState, useEffect } from "react";
import { useAdminStore } from "@/app/store/useAdminStore";
import {
  Users,
  Mail,
  Trash2,
  Pencil,
  BarChart3,
  FileText,
  GraduationCapIcon,
} from "lucide-react";
import AdminStatCard from "@/app/components/admin/AdminStatCard";

export default function ManageCounselors() {
  const {
    counselors,
    students,
    addCounselor,
    deleteCounselor,
    updateCounselor,
  } = useAdminStore();

  /* ---------- MODAL + EDIT STATE ---------- */

  const [open, setOpen] = useState(false);
  const [editingCounselor, setEditingCounselor] = useState<any | null>(null);

  const initialForm = {
    name: "",
    email: "",
    phone: "",
    capacity: 20,
    skills: [] as string[],
  };

  const [form, setForm] = useState(initialForm);

  /* ---------- PREFILL WHEN EDITING ---------- */

  useEffect(() => {
    if (editingCounselor) {
      setForm(editingCounselor);
    } else {
      setForm(initialForm);
    }
  }, [editingCounselor]);

  /* ---------- STATS ---------- */

  const activeCounselors = counselors.length;
  const totalStudents = students.length;

  const avgCapacity =
    counselors.length > 0
      ? Math.round(
          (students.filter((s) => s.assigned).length /
            counselors.reduce((acc, c) => acc + c.capacity, 0)) *
            100,
        )
      : 0;

  const totalApplications = students.length * 2;

  /* ---------- HANDLERS ---------- */

  const handleEdit = (counselor: any) => {
    setEditingCounselor(counselor);
    setOpen(true);
  };

  const handleSubmit = () => {
    if (!form.name || form.skills.length === 0) return;

    if (editingCounselor) {
      updateCounselor(editingCounselor.id, form);
    } else {
      addCounselor({
        id: Date.now(),
        ...form,
        joined: new Date().toISOString().split("T")[0],
      });
    }

    setOpen(false);
    setEditingCounselor(null);
  };

  const specializations = [
    "Computer Science",
    "Engineering",
    "Business Administration",
    "Medicine",
    "Law",
    "Data Science",
    "Arts & Humanities",
    "Environmental Science",
  ];

  const getLoad = (name: string) =>
    students.filter((s) => s.assigned === name).length;

  return (
    <div className="p-6 space-y-8">
      {/* HEADER */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Manage Counselors</h1>
          <p className="text-slate-500 text-sm">
            Add and manage counselor profiles
          </p>
        </div>

        <button
          onClick={() => {
            setEditingCounselor(null);
            setOpen(true);
          }}
          className="bg-linear-to-r from-purple-600 to-indigo-600 text-white px-5 py-2 rounded-xl shadow hover:opacity-90 transition"
        >
          + Add Counselor
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <AdminStatCard
          title="Active Counselors"
          value={activeCounselors}
          icon={<Users className="w-8 h-8 text-green-600" />}
          valueColor="text-green-600"
        />

        <AdminStatCard
          title="Total Students"
          value={totalStudents}
          icon={<GraduationCapIcon className="w-8 h-8 text-blue-600" />}
          valueColor="text-blue-600"
        />

        <AdminStatCard
          title="Avg Capacity Used"
          value={`${avgCapacity}%`}
          icon={<BarChart3 className="w-8 h-8 text-purple-600" />}
          valueColor="text-purple-600"
        />

        <AdminStatCard
          title="Total Applications"
          value={totalApplications}
          icon={<FileText className="w-8 h-8 text-orange-600" />}
          valueColor="text-orange-600"
        />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-x-auto">
        <h2 className="text-lg font-semibold m-4">Counselor List</h2>

        <table className="w-full text-sm">
          <thead className="border-b border-slate-100 text-slate-500">
            <tr>
              <th className="text-left p-4">Counselor</th>
              <th>Contact</th>
              <th>Specializations</th>
              <th>Students</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {counselors.map((c) => {
              const load = getLoad(c.name);
              const isActive = load < c.capacity;

              return (
                <tr
                  key={c.id}
                  className="border-b border-slate-100 hover:bg-slate-50 transition"
                >
                  <td className="p-4">
                    <div className="font-medium">{c.name}</div>
                    <div className="text-xs text-slate-400">
                      Joined: {c.joined}
                    </div>
                  </td>

                  <td className="text-xs">
                    {c.email}
                    <br />
                    {c.phone}
                  </td>

                  <td className="p-4">
                    <div className="flex flex-wrap gap-2">
                      {c.skills.map((s) => (
                        <span
                          key={s}
                          className="bg-slate-100 px-2 py-1 rounded-full text-xs"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td>
                    {load}/{c.capacity}
                  </td>

                  <td>
                    <span
                      className={`px-3 py-1 text-xs rounded-full ${
                        isActive
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {isActive ? "Active" : "Full"}
                    </span>
                  </td>

                  <td>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(c)}
                        className="p-2 rounded-lg hover:bg-slate-100"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        onClick={() =>
                          (window.location.href = `mailto:${c.email}`)
                        }
                        className="p-2 rounded-lg hover:bg-slate-100"
                      >
                        <Mail size={16} />
                      </button>

                      <button
                        onClick={() => deleteCounselor(c.id)}
                        className="p-2 rounded-lg hover:bg-red-100 text-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-xl rounded-2xl p-6 space-y-5">
            <h2 className="text-lg font-semibold">
              {editingCounselor ? "Edit Counselor" : "Add New Counselor"}
            </h2>

            <input
              placeholder="Full Name"
              className="w-full border border-slate-200 p-2 rounded-lg"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <input
              placeholder="Email"
              className="w-full border border-slate-200 p-2 rounded-lg"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <input
              placeholder="Phone"
              className="w-full border border-slate-200 p-2 rounded-lg"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />

            <div>
              <label className="text-sm font-medium block mb-2">
                Specializations
              </label>

              <div className="grid grid-cols-2 gap-2">
                {specializations.map((skill) => (
                  <label
                    key={skill}
                    className="flex items-center gap-2 text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={form.skills.includes(skill)}
                      onChange={() => {
                        if (form.skills.includes(skill)) {
                          setForm({
                            ...form,
                            skills: form.skills.filter((s) => s !== skill),
                          });
                        } else {
                          setForm({
                            ...form,
                            skills: [...form.skills, skill],
                          });
                        }
                      }}
                    />
                    {skill}
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={() => {
                  setOpen(false);
                  setEditingCounselor(null);
                }}
                className="px-4 py-2 rounded-lg border border-slate-200"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                className="px-4 py-2 rounded-lg bg-purple-600 text-white"
              >
                {editingCounselor ? "Update Counselor" : "Add Counselor"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

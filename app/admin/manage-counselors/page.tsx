"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Users,
  Mail,
  Trash2,
  Pencil,
  BarChart3,
  FileText,
  GraduationCapIcon,
} from "lucide-react";
import { toast } from "sonner";
import AdminStatCard from "@/app/components/admin/AdminStatCard";
import { AdminCounselor, adminApi } from "@/app/libs/adminApi";

type CounselorForm = {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  capacity: number;
  skills: string[];
  isActive: boolean;
};

const initialForm: CounselorForm = {
  fullName: "",
  email: "",
  password: "",
  phone: "",
  capacity: 20,
  skills: [],
  isActive: true,
};

export default function ManageCounselors() {
  const [counselors, setCounselors] = useState<AdminCounselor[]>([]);
  const [studentSummary, setStudentSummary] = useState({
    total: 0,
    assigned: 0,
    unassigned: 0,
  });
  const [open, setOpen] = useState(false);
  const [editingCounselor, setEditingCounselor] =
    useState<AdminCounselor | null>(null);
  const [form, setForm] = useState<CounselorForm>(initialForm);
  const [saving, setSaving] = useState(false);

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

  const loadData = async () => {
    try {
      const [counselorRes, studentRes] = await Promise.all([
        adminApi.getCounselors(),
        adminApi.getStudents(),
      ]);

      setCounselors(counselorRes.counselors || []);
      setStudentSummary(
        studentRes.summary || { total: 0, assigned: 0, unassigned: 0 },
      );
    } catch (error) {
      console.error("Failed to load counselors:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to load counselors",
      );
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!editingCounselor) {
      setForm(initialForm);
      return;
    }

    setForm({
      fullName: editingCounselor.name,
      email: editingCounselor.email,
      password: "",
      phone: editingCounselor.phone || "",
      capacity: editingCounselor.capacity || 20,
      skills: editingCounselor.skills || [],
      isActive: editingCounselor.isActive,
    });
  }, [editingCounselor]);

  const stats = useMemo(() => {
    const activeCounselors = counselors.filter((c) => c.isActive).length;
    const avgCapacity = counselors.length
      ? Math.round(
          counselors.reduce((acc, counselor) => {
            const cap = counselor.capacity || 20;
            if (!cap) return acc;
            return acc + (counselor.assignedStudents / cap) * 100;
          }, 0) / counselors.length || 0,
        )
      : 0;

    return {
      activeCounselors,
      totalStudents: studentSummary.total,
      avgCapacity,
      totalApplications: studentSummary.assigned,
    };
  }, [counselors, studentSummary]);

  const handleEdit = (counselor: AdminCounselor) => {
    setEditingCounselor(counselor);
    setOpen(true);
  };

  const handleSubmit = async () => {
    if (
      !form.fullName.trim() ||
      !form.email.trim() ||
      form.skills.length === 0
    ) {
      toast.error("Name, email and at least one specialization are required");
      return;
    }

    if (!editingCounselor && form.password.trim().length < 6) {
      toast.error(
        "Please provide at least 6 characters for counselor password",
      );
      return;
    }

    setSaving(true);
    try {
      if (editingCounselor) {
        const payload: Record<string, unknown> = {
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
          capacity: form.capacity,
          skills: form.skills,
          isActive: form.isActive,
        };

        if (form.password.trim()) {
          payload.password = form.password.trim();
        }

        await adminApi.updateCounselor(editingCounselor.id, payload);
      } else {
        await adminApi.createCounselor({
          fullName: form.fullName,
          email: form.email,
          password: form.password,
          phone: form.phone,
          capacity: form.capacity,
          skills: form.skills,
          isActive: true,
        });
      }

      setOpen(false);
      setEditingCounselor(null);
      setForm(initialForm);
      await loadData();
      toast.success(
        editingCounselor
          ? "Counselor updated successfully"
          : "Counselor added successfully",
      );
    } catch (error) {
      console.error("Failed to save counselor:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to save counselor",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (
      !window.confirm("Disable this counselor and clear their assignments?")
    ) {
      return;
    }

    try {
      await adminApi.deleteCounselor(id);
      await loadData();
      toast.success("Counselor disabled successfully");
    } catch (error) {
      console.error("Failed to delete counselor:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete counselor",
      );
    }
  };

  return (
    <div className="p-6 space-y-8">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <AdminStatCard
          title="Active Counselors"
          value={stats.activeCounselors}
          icon={<Users className="w-8 h-8 text-green-600" />}
          valueColor="text-green-600"
        />

        <AdminStatCard
          title="Total Students"
          value={stats.totalStudents}
          icon={<GraduationCapIcon className="w-8 h-8 text-blue-600" />}
          valueColor="text-blue-600"
        />

        <AdminStatCard
          title="Avg Capacity Used"
          value={`${stats.avgCapacity}%`}
          icon={<BarChart3 className="w-8 h-8 text-purple-600" />}
          valueColor="text-purple-600"
        />

        <AdminStatCard
          title="Total Applications"
          value={stats.totalApplications}
          icon={<FileText className="w-8 h-8 text-orange-600" />}
          valueColor="text-orange-600"
        />
      </div>

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
              const load = c.assignedStudents;
              const isActive = c.isActive && load < c.capacity;

              return (
                <tr
                  key={c.id}
                  className="border-b border-slate-100 hover:bg-slate-50 transition"
                >
                  <td className="p-4">
                    <div className="font-medium">{c.name}</div>
                    <div className="text-xs text-slate-400">
                      Joined: {new Date(c.joined).toISOString().slice(0, 10)}
                    </div>
                  </td>

                  <td className="text-xs">
                    {c.email}
                    <br />
                    {c.phone || "-"}
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
                      {isActive ? "Active" : "Full/Inactive"}
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
                        onClick={() => handleDelete(c.id)}
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

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-xl rounded-2xl p-6 space-y-5">
            <h2 className="text-lg font-semibold">
              {editingCounselor ? "Edit Counselor" : "Add New Counselor"}
            </h2>

            <input
              placeholder="Full Name"
              className="w-full border border-slate-200 p-2 rounded-lg"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            />

            <input
              placeholder="Email"
              className="w-full border border-slate-200 p-2 rounded-lg"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <input
              placeholder={
                editingCounselor ? "New password (optional)" : "Password"
              }
              type="password"
              className="w-full border border-slate-200 p-2 rounded-lg"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />

            <input
              placeholder="Phone"
              className="w-full border border-slate-200 p-2 rounded-lg"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />

            <input
              placeholder="Capacity"
              type="number"
              min={1}
              className="w-full border border-slate-200 p-2 rounded-lg"
              value={form.capacity}
              onChange={(e) =>
                setForm({ ...form, capacity: Number(e.target.value) || 20 })
              }
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
                disabled={saving}
                onClick={handleSubmit}
                className="px-4 py-2 rounded-lg bg-purple-600 text-white disabled:opacity-60"
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

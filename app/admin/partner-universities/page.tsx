"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Pencil,
  Trash2,
  ExternalLink,
  School,
  MapPin,
  Globe,
} from "lucide-react";
import AdminStatCard from "@/app/components/admin/AdminStatCard";
import { AdminUniversity, adminApi } from "@/app/libs/adminApi";

type UniversityForm = {
  name: string;
  ranking: number;
  country: string;
  city: string;
  tuitionFee: number;
  applicationFee: number;
  minGpa: number;
  minIelts: number;
  website: string;
  programs: string;
  description: string;
  isPartnered: boolean;
};

const initialForm: UniversityForm = {
  name: "",
  ranking: 0,
  country: "",
  city: "",
  tuitionFee: 0,
  applicationFee: 0,
  minGpa: 0,
  minIelts: 0,
  website: "",
  programs: "",
  description: "",
  isPartnered: true,
};

export default function PartneredUniversities() {
  const [universities, setUniversities] = useState<AdminUniversity[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<AdminUniversity | null>(null);
  const [form, setForm] = useState<UniversityForm>(initialForm);
  const [saving, setSaving] = useState(false);

  const loadUniversities = async () => {
    try {
      const response = await adminApi.getUniversities();
      setUniversities(response.universities || []);
    } catch (error) {
      console.error("Failed to load universities:", error);
      alert(
        error instanceof Error ? error.message : "Failed to load universities",
      );
    }
  };

  useEffect(() => {
    loadUniversities();
  }, []);

  const totalUniversities = universities.length;
  const countries = new Set(universities.map((u) => u.country).filter(Boolean))
    .size;
  const avgRanking =
    universities.length > 0
      ? Math.round(
          universities.reduce((acc, u) => acc + (u.world_ranking || 0), 0) /
            universities.length,
        )
      : 0;

  const avgGpa =
    universities.length > 0
      ? (
          universities.reduce((acc, u) => acc + (u.min_gpa || 0), 0) /
          universities.length
        ).toFixed(2)
      : "0";

  const partneredCount = useMemo(
    () => universities.filter((u) => u.is_partnered).length,
    [universities],
  );

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.country.trim()) {
      alert("University name and country are required");
      return;
    }

    const payload = {
      name: form.name,
      ranking: form.ranking || undefined,
      country: form.country,
      city: form.city || undefined,
      tuitionFee: form.tuitionFee || undefined,
      applicationFee: form.applicationFee || undefined,
      minGpa: form.minGpa,
      minIelts: form.minIelts || undefined,
      website: form.website || undefined,
      description: form.description || undefined,
      programs: form.programs
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean),
      isPartnered: form.isPartnered,
    };

    setSaving(true);
    try {
      if (editing) {
        await adminApi.updateUniversity(editing.id, payload);
      } else {
        await adminApi.createUniversity(payload);
      }

      await loadUniversities();
      setOpen(false);
      setEditing(null);
      setForm(initialForm);
    } catch (error) {
      console.error("Failed to save university:", error);
      alert(
        error instanceof Error ? error.message : "Failed to save university",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (uni: AdminUniversity) => {
    setEditing(uni);
    setForm({
      name: uni.name,
      ranking: uni.world_ranking || 0,
      country: uni.country || "",
      city: uni.city || "",
      tuitionFee: uni.tuition_fee_usd || 0,
      applicationFee: uni.application_fee_usd || 0,
      minGpa: uni.min_gpa || 0,
      minIelts: uni.min_ielts || 0,
      website: uni.website || "",
      programs: (uni.fields_offered || []).join(", "),
      description: uni.description || "",
      isPartnered: !!uni.is_partnered,
    });
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this university record?")) {
      return;
    }

    try {
      await adminApi.deleteUniversity(id);
      await loadUniversities();
    } catch (error) {
      console.error("Failed to delete university:", error);
      alert(
        error instanceof Error ? error.message : "Failed to delete university",
      );
    }
  };

  const handleTogglePartnership = async (uni: AdminUniversity) => {
    try {
      await adminApi.toggleUniversityPartnership(uni.id, {
        isPartnered: !uni.is_partnered,
        partnershipNotes: uni.partnership_notes || undefined,
      });
      await loadUniversities();
    } catch (error) {
      console.error("Failed to toggle partnership:", error);
      alert(
        error instanceof Error ? error.message : "Failed to update partnership",
      );
    }
  };

  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Partnered Universities</h1>
          <p className="text-slate-500 text-sm">
            Manage all universities and partnership states
          </p>
        </div>

        <button
          onClick={() => {
            setEditing(null);
            setForm(initialForm);
            setOpen(true);
          }}
          className="bg-linear-to-r from-purple-600 to-indigo-600 text-white px-5 py-2 rounded-xl shadow"
        >
          + Add University
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <AdminStatCard
          title="Total Universities"
          value={totalUniversities}
          icon={<School className="w-8 h-8 text-blue-600" />}
          valueColor="text-blue-600"
        />
        <AdminStatCard
          title="Partnered"
          value={partneredCount}
          icon={<Globe className="w-8 h-8 text-emerald-600" />}
          valueColor="text-emerald-600"
        />
        <AdminStatCard
          title="Countries"
          value={countries}
          icon={<MapPin className="w-8 h-8 text-green-600" />}
          valueColor="text-green-600"
        />
        <AdminStatCard
          title="Avg Ranking"
          value={avgRanking}
          icon={<School className="w-8 h-8 text-purple-600" />}
          valueColor="text-purple-600"
        />
        <AdminStatCard
          title="Avg GPA Req"
          value={avgGpa}
          icon={<School className="w-8 h-8 text-orange-600" />}
          valueColor="text-orange-600"
        />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
        <h2 className="text-lg font-semibold m-4">Universities</h2>
        <p className="text-sm text-slate-500 ml-4 mb-4">
          Shows all current universities and partnership status
        </p>
        <table className="w-full text-sm">
          <thead className="border-b border-slate-100 text-slate-500">
            <tr>
              <th className="text-left p-4">University</th>
              <th>Location</th>
              <th>Ranking</th>
              <th>Requirements</th>
              <th>Costs</th>
              <th>Partnership</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {universities.map((u) => (
              <tr
                key={u.id}
                className="border-b border-slate-100 hover:bg-slate-50 transition"
              >
                <td className="p-4 font-medium">{u.name}</td>
                <td>
                  {u.city || "-"}, {u.country}
                </td>
                <td>{u.world_ranking ? `#${u.world_ranking}` : "-"}</td>
                <td>
                  GPA: {u.min_gpa ?? "-"}
                  <br />
                  IELTS: {u.min_ielts ?? "-"}
                </td>
                <td>
                  Tuition: {u.tuition_fee_usd ? `$${u.tuition_fee_usd}` : "-"}
                  <br />
                  App Fee:{" "}
                  {u.application_fee_usd ? `$${u.application_fee_usd}` : "-"}
                </td>
                <td>
                  <button
                    onClick={() => handleTogglePartnership(u)}
                    className={`px-3 py-1 rounded-full text-xs ${
                      u.is_partnered
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {u.is_partnered ? "Partnered" : "Not Partnered"}
                  </button>
                </td>
                <td className="flex gap-2 py-2">
                  <button
                    onClick={() => handleEdit(u)}
                    className="p-2 hover:bg-slate-100 rounded-lg"
                  >
                    <Pencil size={16} />
                  </button>

                  <a
                    href={u.website || "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 hover:bg-slate-100 rounded-lg"
                  >
                    <ExternalLink size={16} />
                  </a>

                  <button
                    onClick={() => handleDelete(u.id)}
                    className="p-2 hover:bg-red-100 text-red-500 rounded-lg"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold">
              {editing ? "Edit University" : "Add New University"}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  University Name
                </label>
                <input
                  type="text"
                  placeholder="Enter university name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-slate-200 p-2 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Global Ranking
                </label>
                <input
                  type="number"
                  placeholder="Enter global ranking"
                  value={form.ranking}
                  onChange={(e) =>
                    setForm({ ...form, ranking: Number(e.target.value) })
                  }
                  className="w-full border border-slate-200 p-2 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Country
                  </label>
                  <input
                    placeholder="Enter country"
                    value={form.country}
                    onChange={(e) =>
                      setForm({ ...form, country: e.target.value })
                    }
                    className="w-full border border-slate-200 p-2 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">City</label>
                  <input
                    placeholder="Enter city"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full border border-slate-200 p-2 rounded-lg"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Annual Tuition Fee ($)
                </label>
                <input
                  type="number"
                  placeholder="Enter tuition fee"
                  value={form.tuitionFee}
                  onChange={(e) =>
                    setForm({ ...form, tuitionFee: Number(e.target.value) })
                  }
                  className="w-full border border-slate-200 p-2 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Application Fee ($)
                </label>
                <input
                  type="number"
                  placeholder="Enter application fee"
                  value={form.applicationFee}
                  onChange={(e) =>
                    setForm({ ...form, applicationFee: Number(e.target.value) })
                  }
                  className="w-full border border-slate-200 p-2 rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Minimum GPA Requirement
                </label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="Enter minimum GPA"
                  value={form.minGpa}
                  onChange={(e) =>
                    setForm({ ...form, minGpa: Number(e.target.value) })
                  }
                  className="w-full border border-slate-200 p-2 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Minimum IELTS Requirement
                </label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="Enter minimum IELTS"
                  value={form.minIelts}
                  onChange={(e) =>
                    setForm({ ...form, minIelts: Number(e.target.value) })
                  }
                  className="w-full border border-slate-200 p-2 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                University Website
              </label>
              <input
                type="url"
                placeholder="https://www.example.edu"
                value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
                className="w-full border border-slate-200 p-2 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Available Programs
              </label>
              <input
                placeholder="Separate programs with commas"
                value={form.programs}
                onChange={(e) => setForm({ ...form, programs: e.target.value })}
                className="w-full border border-slate-200 p-2 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                rows={3}
                placeholder="Brief description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="w-full border border-slate-200 p-2 rounded-lg"
              />
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.isPartnered}
                onChange={(e) =>
                  setForm({ ...form, isPartnered: e.target.checked })
                }
              />
              Mark as partnered
            </label>

            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 border border-slate-200 rounded-lg"
              >
                Cancel
              </button>

              <button
                disabled={saving}
                onClick={handleSubmit}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg disabled:opacity-60"
              >
                {editing ? "Update University" : "Add University"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

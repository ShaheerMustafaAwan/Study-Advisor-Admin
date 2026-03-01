"use client";

import { useState } from "react";
import {
  Globe,
  Pencil,
  Trash2,
  ExternalLink,
  School,
  MapPin,
} from "lucide-react";
import { useAdminStore } from "@/app/store/useAdminStore";
import AdminStatCard from "@/app/components/admin/AdminStatCard";

export default function PartneredUniversities() {
  const { universities, addUniversity, updateUniversity, deleteUniversity } =
    useAdminStore();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  const [form, setForm] = useState({
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
  });

  const emptyForm = {
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
  };

  /* ------------------ STATS ------------------ */

  const totalUniversities = universities.length;

  const countries = new Set(universities.map((u) => u.country)).size;

  const avgRanking =
    universities.length > 0
      ? Math.round(
          universities.reduce((acc, u) => acc + u.ranking, 0) /
            universities.length,
        )
      : 0;

  const avgGpa =
    universities.length > 0
      ? (
          universities.reduce((acc, u) => acc + u.minGpa, 0) /
          universities.length
        ).toFixed(2)
      : 0;

  /* ------------------ HANDLERS ------------------ */

  const handleSubmit = () => {
    const university = {
      id: editing ? editing.id : Date.now(),
      ...form,
      programs: form.programs.split(",").map((p) => p.trim()),
    };

    if (editing) {
      updateUniversity(university);
    } else {
      addUniversity(university);
    }

    setOpen(false);
    setEditing(null);
    setForm({
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
    });
  };

  const handleEdit = (uni: any) => {
    setEditing(uni);
    setForm({
      ...uni,
      programs: uni.programs.join(", "),
    });
    setOpen(true);
  };

  return (
    <div className="p-6 space-y-8">
      {/* HEADER */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Partnered Universities</h1>
          <p className="text-slate-500 text-sm">
            Manage and track global university partnerships
          </p>
        </div>

        <button
          onClick={() => {
            setEditing(null);
            setForm({
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
            });
            setOpen(true);
          }}
          className="bg-linear-to-r from-purple-600 to-indigo-600 text-white px-5 py-2 rounded-xl shadow"
        >
          + Add University
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <AdminStatCard
          title="Total Universities"
          value={totalUniversities}
          icon={<School className="w-8 h-8 text-blue-600" />}
          valueColor="text-blue-600"
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

      {/* TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
        <h2 className="text-lg font-semibold m-4">University Partnerships</h2>
        <p className="text-sm text-slate-500 ml-4">
          Manage your university partnerships and their requirements
        </p>
        <table className="w-full text-sm">
          <thead className="border-b border-slate-100 text-slate-500">
            <tr>
              <th className="text-left p-4">University</th>
              <th>Location</th>
              <th>Ranking</th>
              <th>Requirements</th>
              <th>Costs</th>
              <th>Programs</th>
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
                  {u.city}, {u.country}
                </td>
                <td>#{u.ranking}</td>
                <td>
                  GPA: {u.minGpa}
                  <br />
                  IELTS: {u.minIelts}
                </td>
                <td>
                  Tuition: ${u.tuitionFee}
                  <br />
                  App Fee: ${u.applicationFee}
                </td>
                <td className="max-w-xs">
                  {u.programs.slice(0, 2).join(", ")}
                  {u.programs.length > 2 && "..."}
                </td>
                <td className="flex gap-2">
                  <button
                    onClick={() => handleEdit(u)}
                    className="p-2 hover:bg-slate-100 rounded-lg"
                  >
                    <Pencil size={16} />
                  </button>

                  <a
                    href={u.website}
                    target="_blank"
                    className="p-2 hover:bg-slate-100 rounded-lg"
                  >
                    <ExternalLink size={16} />
                  </a>

                  <button
                    onClick={() => deleteUniversity(u.id)}
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

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold">
              {editing ? "Edit University" : "Add New University"}
            </h2>

            {/* BASIC INFO */}
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
                  placeholder="Enter global ranking (e.g. 25)"
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

            {/* COSTS */}
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

            {/* REQUIREMENTS */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Minimum GPA Requirement
                </label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="Enter minimum GPA (e.g. 3.2)"
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
                  placeholder="Enter minimum IELTS (e.g. 6.5)"
                  value={form.minIelts}
                  onChange={(e) =>
                    setForm({ ...form, minIelts: Number(e.target.value) })
                  }
                  className="w-full border border-slate-200 p-2 rounded-lg"
                />
              </div>
            </div>

            {/* WEBSITE */}
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

            {/* PROGRAMS */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Available Programs
              </label>
              <input
                placeholder="Separate programs with commas (e.g. Computer Science, Law, Medicine)"
                value={form.programs}
                onChange={(e) => setForm({ ...form, programs: e.target.value })}
                className="w-full border border-slate-200 p-2 rounded-lg"
              />
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                rows={3}
                placeholder="Brief description about the university..."
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="w-full border border-slate-200 p-2 rounded-lg"
              />
            </div>

            {/* ACTIONS */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 border border-slate-200 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg"
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

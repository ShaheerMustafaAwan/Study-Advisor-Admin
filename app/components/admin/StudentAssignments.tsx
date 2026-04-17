"use client";

import { useMemo, useState } from "react";
import { Eye, Search, X } from "lucide-react";
import {
  AdminCounselor,
  AdminStudent,
  AdminStudentDetails,
  adminApi,
} from "@/app/libs/adminApi";

type StudentAssignmentsProps = {
  counselors: AdminCounselor[];
  students: AdminStudent[];
  onAssign: (student: AdminStudent, counselorId: number) => Promise<void>;
  onUnassign: (student: AdminStudent) => Promise<void>;
  focusStudentId?: number | null;
};

export default function StudentAssignments({
  counselors,
  students,
  onAssign,
  onUnassign,
  focusStudentId = null,
}: StudentAssignmentsProps) {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [pendingStudentId, setPendingStudentId] = useState<number | null>(null);
  const [selectedStudent, setSelectedStudent] =
    useState<AdminStudentDetails | null>(null);
  const [viewLoadingId, setViewLoadingId] = useState<number | null>(null);
  const [viewError, setViewError] = useState<string>("");

  const filteredStudents = useMemo(() => {
    const items = students.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(search.toLowerCase()) ||
        student.program.toLowerCase().includes(search.toLowerCase()) ||
        student.location.toLowerCase().includes(search.toLowerCase());

      const matchesFilter =
        filter === "All"
          ? true
          : filter === "Assigned"
            ? !!student.assignedCounselor
            : !student.assignedCounselor;

      return matchesSearch && matchesFilter;
    });

    if (!focusStudentId) {
      return items;
    }

    return [...items].sort((a, b) => {
      if (a.id === focusStudentId) return -1;
      if (b.id === focusStudentId) return 1;
      return 0;
    });
  }, [students, search, filter, focusStudentId]);

  const handleAssignmentChange = async (
    student: AdminStudent,
    value: string,
  ) => {
    if (!value) {
      if (!student.assignedCounselor) return;
      setPendingStudentId(student.id);
      try {
        await onUnassign(student);
      } finally {
        setPendingStudentId(null);
      }
      return;
    }

    const counselorId = Number(value);
    if (Number.isNaN(counselorId)) return;

    setPendingStudentId(student.id);
    try {
      await onAssign(student, counselorId);
    } finally {
      setPendingStudentId(null);
    }
  };

  const handleViewStudent = async (studentId: number) => {
    setViewLoadingId(studentId);
    setViewError("");
    try {
      const res = await adminApi.getStudentDetails(studentId);
      setSelectedStudent(res.student);
    } catch (error) {
      setViewError(
        error instanceof Error
          ? error.message
          : "Failed to load student details",
      );
    } finally {
      setViewLoadingId(null);
    }
  };

  const closeModal = () => {
    setSelectedStudent(null);
    setViewError("");
  };

  const formatDocType = (type: string) =>
    String(type || "")
      .toLowerCase()
      .split("_")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Student Assignments</h2>
        <p className="text-sm text-slate-500">
          Assign students based on specialization and availability
        </p>
      </div>

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
                className={`border-b border-slate-100 hover:bg-slate-50 transition ${
                  focusStudentId === student.id ? "bg-amber-50" : ""
                }`}
              >
                <td className="py-4 font-medium">{student.name}</td>
                <td>{student.program}</td>
                <td>{student.location}</td>
                <td>{new Date(student.date).toISOString().slice(0, 10)}</td>

                <td>
                  {student.assignedCounselor ? (
                    <span className="text-green-600 bg-green-50 px-3 py-1 rounded-full text-xs">
                      {student.assignedCounselor.name}
                    </span>
                  ) : (
                    <span className="text-slate-500 bg-slate-100 px-3 py-1 rounded-full text-xs">
                      Unassigned
                    </span>
                  )}
                </td>

                <td>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      title="View student info"
                      aria-label={`View ${student.name} details`}
                      disabled={viewLoadingId === student.id}
                      onClick={() => handleViewStudent(student.id)}
                      className="inline-flex items-center justify-center p-1.5 border border-slate-200 rounded-md text-slate-600 hover:bg-slate-100 disabled:opacity-50"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    <select
                      disabled={pendingStudentId === student.id}
                      onChange={(e) =>
                        handleAssignmentChange(student, e.target.value)
                      }
                      value={student.assignedCounselor?.id || ""}
                      className="border border-slate-200 rounded-lg px-3 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Unassign</option>

                      {counselors.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.assignedStudents}/{c.capacity})
                        </option>
                      ))}
                    </select>
                  </div>
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

      {viewError && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {viewError}
        </div>
      )}

      {selectedStudent && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-xl border border-slate-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-semibold">
                  {selectedStudent.name}
                </h3>
                <p className="text-sm text-slate-500">
                  {selectedStudent.email}
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="p-2 rounded-lg text-slate-500 hover:bg-slate-100"
                aria-label="Close details"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h4 className="text-sm font-semibold text-slate-800 mb-3">
                  Student Info
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <p>
                    <span className="text-slate-500">Role:</span>{" "}
                    {selectedStudent.role}
                  </p>
                  <p>
                    <span className="text-slate-500">Phone:</span>{" "}
                    {selectedStudent.profile.phoneNumber || "Not provided"}
                  </p>
                  <p>
                    <span className="text-slate-500">Nationality:</span>{" "}
                    {selectedStudent.profile.nationality || "Not provided"}
                  </p>
                  <p>
                    <span className="text-slate-500">Program:</span>{" "}
                    {selectedStudent.profile.desiredProgram || "Not selected"}
                  </p>
                  <p>
                    <span className="text-slate-500">Preferred Country:</span>{" "}
                    {selectedStudent.profile.preferredCountry || "Not selected"}
                  </p>
                  <p>
                    <span className="text-slate-500">Preferred Intake:</span>{" "}
                    {selectedStudent.profile.preferredIntake || "Not selected"}
                  </p>
                  <p>
                    <span className="text-slate-500">Education:</span>{" "}
                    {selectedStudent.profile.currentEducationLevel ||
                      "Not provided"}
                  </p>
                  <p>
                    <span className="text-slate-500">Institution:</span>{" "}
                    {selectedStudent.profile.institutionName || "Not provided"}
                  </p>
                  <p>
                    <span className="text-slate-500">Field:</span>{" "}
                    {selectedStudent.profile.fieldOfStudy || "Not provided"}
                  </p>
                  <p>
                    <span className="text-slate-500">CGPA:</span>{" "}
                    {selectedStudent.profile.cgpa ?? "Not provided"}
                  </p>
                  <p>
                    <span className="text-slate-500">IELTS:</span>{" "}
                    {selectedStudent.profile.ieltsScore ?? "Not provided"}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-800 mb-3">
                  Assigned Counselor
                </h4>
                {selectedStudent.assignedCounselor ? (
                  <p className="text-sm text-slate-700">
                    {selectedStudent.assignedCounselor.name} (
                    {selectedStudent.assignedCounselor.email})
                  </p>
                ) : (
                  <p className="text-sm text-slate-500">
                    No counselor assigned yet.
                  </p>
                )}
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-800 mb-3">
                  Latest SOP Version
                </h4>
                {selectedStudent.latestSop ? (
                  <div className="border border-slate-100 rounded-lg px-3 py-3 text-sm space-y-2">
                    <p className="text-slate-700 font-medium">
                      {selectedStudent.latestSop.title ||
                        "Statement of Purpose"}
                    </p>
                    <p className="text-xs text-slate-500">
                      Version {selectedStudent.latestSop.version} • Status:{" "}
                      {selectedStudent.latestSop.status}
                    </p>
                    {selectedStudent.latestSop.reviewNotes && (
                      <p className="text-xs text-slate-600">
                        Review Notes: {selectedStudent.latestSop.reviewNotes}
                      </p>
                    )}
                    {selectedStudent.latestSop.document?.fileUrl ? (
                      <a
                        href={selectedStudent.latestSop.document.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center text-xs px-3 py-1.5 rounded-md border border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                      >
                        View SOP PDF
                      </a>
                    ) : (
                      <p className="text-xs text-slate-500">
                        No SOP PDF linked.
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">
                    No SOP version available yet.
                  </p>
                )}
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-800 mb-3">
                  Uploaded Documents
                </h4>
                {selectedStudent.documents.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    No documents uploaded.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {selectedStudent.documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between border border-slate-100 rounded-lg px-3 py-2 gap-2"
                      >
                        <div>
                          <p className="text-sm font-medium text-slate-700">
                            {doc.fileName}
                          </p>
                          <p className="text-xs text-slate-500">
                            {formatDocType(doc.type)} •{" "}
                            {new Date(doc.uploadedAt)
                              .toISOString()
                              .slice(0, 10)}
                          </p>
                        </div>

                        <a
                          href={doc.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center justify-center text-xs px-3 py-1.5 rounded-md border border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                        >
                          View Document
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

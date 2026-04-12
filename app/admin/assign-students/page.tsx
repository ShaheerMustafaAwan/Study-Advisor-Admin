"use client";

import { useEffect, useMemo, useState } from "react";
import StatsOverview from "@/app/components/admin/StatsOverview";
import CounselorCapacity from "@/app/components/admin/CounselorCapacity";
import StudentAssignments from "@/app/components/admin/StudentAssignments";
import { AdminCounselor, AdminStudent, adminApi } from "@/app/libs/adminApi";

export default function AssignStudentsPage() {
  const [students, setStudents] = useState<AdminStudent[]>([]);
  const [counselors, setCounselors] = useState<AdminCounselor[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const [studentsRes, counselorsRes] = await Promise.all([
        adminApi.getStudents(),
        adminApi.getCounselors(),
      ]);

      setStudents(studentsRes.students || []);
      setCounselors(counselorsRes.counselors || []);
    } catch (error) {
      console.error("Failed to load assignment data:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to load assignment data",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const summary = useMemo(() => {
    const assigned = students.filter((s) => s.assignedCounselor).length;
    const unassigned = students.length - assigned;

    return {
      total: students.length,
      assigned,
      unassigned,
      counselors: counselors.filter((c) => c.isActive).length,
    };
  }, [students, counselors]);

  const handleAssign = async (student: AdminStudent, counselorId: number) => {
    try {
      const existingAssignmentId = student.assignedCounselor?.assignmentId;
      if (existingAssignmentId) {
        await adminApi.updateAssignment(existingAssignmentId, { counselorId });
      } else {
        await adminApi.createAssignment({ studentId: student.id, counselorId });
      }

      await loadData();
    } catch (error) {
      console.error("Failed to assign student:", error);
      alert(
        error instanceof Error ? error.message : "Failed to assign student",
      );
    }
  };

  const handleUnassign = async (student: AdminStudent) => {
    try {
      const assignmentId = student.assignedCounselor?.assignmentId;
      if (!assignmentId) {
        return;
      }

      await adminApi.deleteAssignment(assignmentId);
      await loadData();
    } catch (error) {
      console.error("Failed to unassign student:", error);
      alert(
        error instanceof Error ? error.message : "Failed to unassign student",
      );
    }
  };

  return (
    <div className="space-y-8 lg:space-y-10">
      <div>
        <h1 className="text-2xl font-semibold">Assign Students</h1>
        <p className="text-blue-500 text-sm">
          Assign new student leads to counselors
        </p>
      </div>

      {loading ? (
        <div className="bg-white border border-slate-200 rounded-xl p-8 text-sm text-slate-500">
          Loading assignments...
        </div>
      ) : (
        <>
          <StatsOverview
            totalStudents={summary.total}
            assignedStudents={summary.assigned}
            unassignedStudents={summary.unassigned}
            activeCounselors={summary.counselors}
          />
          <CounselorCapacity counselors={counselors} />
          <StudentAssignments
            counselors={counselors}
            students={students}
            onAssign={handleAssign}
            onUnassign={handleUnassign}
          />
        </>
      )}
    </div>
  );
}


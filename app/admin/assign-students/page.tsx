"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import StatsOverview from "@/app/components/admin/StatsOverview";
import CounselorCapacity from "@/app/components/admin/CounselorCapacity";
import StudentAssignments from "@/app/components/admin/StudentAssignments";
import {
  AdminCounselor,
  AdminStudent,
  adminApi,
  StudentsPagination,
} from "@/app/libs/adminApi";

const STUDENTS_PAGE_LIMIT = 20;

export default function AssignStudentsPage() {
  const searchParams = useSearchParams();
  const [students, setStudents] = useState<AdminStudent[]>([]);
  const [counselors, setCounselors] = useState<AdminCounselor[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [studentSummary, setStudentSummary] = useState({
    total: 0,
    assigned: 0,
    unassigned: 0,
  });
  const [pagination, setPagination] = useState<StudentsPagination>({
    page: 1,
    limit: STUDENTS_PAGE_LIMIT,
    total: 0,
    totalPages: 1,
  });

  const focusStudentId = useMemo(() => {
    const raw = searchParams.get("studentId");
    if (!raw) return null;
    const parsed = Number(raw);
    return Number.isNaN(parsed) ? null : parsed;
  }, [searchParams]);

  const loadData = async (nextPage = 1) => {
    try {
      setLoading(true);
      const [studentsRes, counselorsRes] = await Promise.all([
        adminApi.getStudents({ page: nextPage, limit: STUDENTS_PAGE_LIMIT }),
        adminApi.getCounselors(),
      ]);

      const pageInfo = studentsRes.pagination || {
        page: nextPage,
        limit: STUDENTS_PAGE_LIMIT,
        total: studentsRes.summary.total,
        totalPages: 1,
      };

      setPage(pageInfo.page);
      setPagination(pageInfo);
      setStudentSummary(
        studentsRes.summary || {
          total: pageInfo.total,
          assigned: 0,
          unassigned: pageInfo.total,
        },
      );
      setStudents(studentsRes.students || []);
      setCounselors(counselorsRes.counselors || []);
    } catch (error) {
      console.error("Failed to load assignment data:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to load assignment data",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(1);
  }, []);

  const activeCounselorCount = useMemo(
    () => counselors.filter((c) => c.isActive).length,
    [counselors],
  );

  const handleAssign = async (student: AdminStudent, counselorId: number) => {
    try {
      const existingAssignmentId = student.assignedCounselor?.assignmentId;
      if (existingAssignmentId) {
        await adminApi.updateAssignment(existingAssignmentId, { counselorId });
      } else {
        await adminApi.createAssignment({ studentId: student.id, counselorId });
      }

      await loadData(page);
      toast.success("Student assignment updated");
    } catch (error) {
      console.error("Failed to assign student:", error);
      toast.error(
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
      await loadData(page);
      toast.success("Student unassigned successfully");
    } catch (error) {
      console.error("Failed to unassign student:", error);
      toast.error(
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
            totalStudents={studentSummary.total}
            assignedStudents={studentSummary.assigned}
            unassignedStudents={studentSummary.unassigned}
            activeCounselors={activeCounselorCount}
          />
          <CounselorCapacity counselors={counselors} />
          <StudentAssignments
            counselors={counselors}
            students={students}
            onAssign={handleAssign}
            onUnassign={handleUnassign}
            focusStudentId={focusStudentId}
          />

          <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-sm text-slate-600">
              Showing page {pagination.page} of {pagination.totalPages} (
              {pagination.total} students)
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => loadData(page - 1)}
                className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50"
              >
                Previous
              </button>

              <button
                type="button"
                disabled={page >= pagination.totalPages}
                onClick={() => loadData(page + 1)}
                className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

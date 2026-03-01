import StatsOverview from "@/app/components/admin/StatsOverview";
import CounselorCapacity from "@/app/components/admin/CounselorCapacity";
import StudentAssignments from "@/app/components/admin/StudentAssignments";

export default function AssignStudentsPage() {
  return (
    <div className="space-y-8 lg:space-y-10">
      <div>
        <h1 className="text-2xl font-semibold">Assign Students</h1>
        <p className="text-slate-500 text-sm">
          Assign new student leads to counselors
        </p>
      </div>

      <StatsOverview />
      <CounselorCapacity />
      <StudentAssignments />
    </div>
  );
}

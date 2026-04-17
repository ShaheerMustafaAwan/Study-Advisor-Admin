"use client";

import { useEffect, useMemo, useState } from "react";
import HeroSection from "../components/admin/HeroSection";
import OverviewCards from "../components/admin/OverviewCards";
import QuickLinksCards from "../components/admin/QuickLinksCards";
import MonthlyTrends from "../components/admin/MonthlyTrends";
import RecentActivity from "../components/admin/RecentActivity";
import {
  adminApi,
  DashboardActivity,
  DashboardSummaryResponse,
  DashboardTrend,
  formatRelativeTime,
} from "../libs/adminApi";

export default function AdminDashboard() {
  const [summary, setSummary] = useState<DashboardSummaryResponse | null>(null);
  const [trends, setTrends] = useState<DashboardTrend[]>([]);
  const [activities, setActivities] = useState<DashboardActivity[]>([]);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        const [summaryRes, trendsRes, activitiesRes] = await Promise.all([
          adminApi.getDashboardSummary(),
          adminApi.getDashboardMonthlyTrends(),
          adminApi.getDashboardRecentActivity(),
        ]);

        if (!isMounted) return;
        setSummary(summaryRes);
        setTrends(trendsRes.trends || []);
        setActivities(
          (activitiesRes.activities || []).map((item) => ({
            ...item,
            time: formatRelativeTime(item.time),
          })),
        );
      } catch (error) {
        console.error("Failed to load admin dashboard:", error);
      }
    };

    load();
    const intervalId = setInterval(load, 30000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  const computed = useMemo(
    () => ({
      students: summary?.students.total || 0,
      counselors: summary?.counselors.total || 0,
      universities: summary?.universities.total || 0,
      applications: summary?.applications.total || 0,
      documents: summary?.documents.total || 0,
      sop: summary?.sop.total || 0,
      pendingConnections: summary?.connections.pendingRequests || 0,
    }),
    [summary],
  );

  return (
    <div className="space-y-8 lg:space-y-10">
      <HeroSection
        totalStudents={computed.students}
        totalCounselors={computed.counselors}
        totalUniversities={computed.universities}
        totalApplications={computed.applications}
      />

      <OverviewCards
        totalStudents={computed.students}
        totalDocuments={computed.documents}
        totalSops={computed.sop}
        pendingConnections={computed.pendingConnections}
      />

      <QuickLinksCards />

      <MonthlyTrends data={trends} />

      <RecentActivity activities={activities} />
    </div>
  );
}

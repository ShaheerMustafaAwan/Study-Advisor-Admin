import HeroSection from "../components/admin/HeroSection";
import OverviewCards from "../components/admin/OverviewCards";
import QuickLinksCards from "../components/admin/QuickLinksCards";
import MonthlyTrends from "../components/admin/MonthlyTrends";
import RecentActivity from "../components/admin/RecentActivity";

export default function AdminDashboard() {
  return (
    <div className="space-y-8 lg:space-y-10">
      <HeroSection />

      <OverviewCards />

      <QuickLinksCards />

      <MonthlyTrends />

      <RecentActivity />
    </div>
  );
}

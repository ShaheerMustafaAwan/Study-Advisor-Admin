"use client";

import { useRouter } from "next/navigation";
import { UserPlus, Users, Building2, BarChart3, Settings } from "lucide-react";

type QuickCardProps = {
  title: string;
  description: string;
  count?: number;
  icon: React.ReactNode;
  link: string;
};

function QuickCard({ title, description, count, icon, link }: QuickCardProps) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(link)}
      className="group cursor-pointer rounded-2xl p-6 bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
    >
      <div className="flex justify-between items-start">
        <div className="bg-linear-to-br from-purple-100 to-indigo-100 p-3 rounded-xl group-hover:scale-110 transition">
          {icon}
        </div>

        {count && (
          <span className="bg-purple-50 text-purple-600 text-xs px-3 py-1 rounded-full font-medium">
            {count}
          </span>
        )}
      </div>

      <h3 className="text-lg font-semibold mt-5">{title}</h3>
      <p className="text-sm text-gray-500 mt-2">{description}</p>

      <div className="mt-6 text-sm font-medium text-purple-600 group-hover:underline">
        Open →
      </div>
    </div>
  );
}

export default function QuickLinksCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <QuickCard
        title="Assign Students"
        description="Assign new leads to counselors"
        count={23}
        icon={<UserPlus className="text-purple-600" />}
        link="/admin/assign-students"
      />

      <QuickCard
        title="Manage Counselors"
        description="Add and edit counselor profiles"
        count={12}
        icon={<Users className="text-purple-600" />}
        link="/admin/manage-counselors"
      />

      <QuickCard
        title="Partnered Universities"
        description="Manage university partnerships"
        count={30}
        icon={<Building2 className="text-purple-600" />}
        link="/admin/partner-universities"
      />

      {/* <QuickCard
        title="System Overview"
        description="View analytics and reports"
        icon={<BarChart3 className="text-purple-600" />}
        link="/admin/overview"
      /> */}

      {/* <QuickCard
        title="Settings"
        description="Platform configuration and roles"
        icon={<Settings className="text-purple-600" />}
        link="/admin/general-settings"
      /> */}
    </div>
  );
}

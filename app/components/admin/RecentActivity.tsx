"use client";

import { User, GraduationCap, School, Settings, FileText } from "lucide-react";
import { useState } from "react";

type ActivityItem = {
  id: string;
  type: "Student" | "Counselor" | "University" | "System" | "Document";
  message: string;
  time: string;
  actor?: {
    name: string;
    email: string | null;
    role: string;
  };
  subject?: {
    name: string;
    email: string | null;
    role: string;
  } | null;
  target?: {
    name: string;
    email: string | null;
    role: string;
  } | null;
};

type RecentActivityProps = {
  activities: ActivityItem[];
};

export default function RecentActivity({ activities }: RecentActivityProps) {
  const [showAll, setShowAll] = useState(false);

  const displayedActivities = showAll ? activities : activities.slice(0, 5);

  const getIcon = (type: string) => {
    switch (type) {
      case "Student":
        return <User className="w-4 h-4 text-blue-600" />;
      case "Counselor":
        return <GraduationCap className="w-4 h-4 text-purple-600" />;
      case "University":
        return <School className="w-4 h-4 text-green-600" />;
      case "System":
        return <Settings className="w-4 h-4 text-orange-600" />;
      case "Document":
        return <FileText className="w-4 h-4 text-indigo-600" />;
      default:
        return <User className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-8">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-base sm:text-lg font-semibold">
            Recent System Activity
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Latest platform events and updates
          </p>
        </div>

        {activities.length > 5 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-sm text-purple-600 hover:text-purple-700 font-medium"
          >
            {showAll ? "Show Less" : "View All"}
          </button>
        )}
      </div>

      {/* ACTIVITY LIST */}
      <div className="space-y-4">
        {displayedActivities.map((activity) => (
          <div
            key={activity.id}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-slate-50 hover:bg-slate-100 transition rounded-xl p-4 gap-3"
          >
            <div className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center shadow-sm border border-slate-100">
                {getIcon(activity.type)}
              </div>

              <div>
                <p className="text-sm font-medium text-slate-800">
                  {activity.message}
                </p>
                {activity.actor && (
                  <p className="text-xs text-slate-600 mt-1">
                    By {activity.actor.name}
                    {activity.actor.email ? ` (${activity.actor.email})` : ""}
                    {` • ${activity.actor.role}`}
                  </p>
                )}
                {activity.subject && (
                  <p className="text-xs text-slate-500 mt-1">
                    Subject: {activity.subject.name}
                    {activity.subject.email
                      ? ` (${activity.subject.email})`
                      : ""}
                    {` • ${activity.subject.role}`}
                  </p>
                )}
                {activity.target && (
                  <p className="text-xs text-slate-500 mt-1">
                    Target: {activity.target.name}
                    {activity.target.email ? ` (${activity.target.email})` : ""}
                    {` • ${activity.target.role}`}
                  </p>
                )}
                <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
              </div>
            </div>

            <span className="text-xs font-medium text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200 w-fit">
              {activity.type}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

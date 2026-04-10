"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

type TrendItem = {
  month: string;
  students: number;
  applications: number;
  documents: number;
};

type MonthlyTrendsProps = {
  data: TrendItem[];
};

export default function MonthlyTrends({ data }: MonthlyTrendsProps) {
  const chartData = data.length
    ? data
    : [
        { month: "Jan", students: 0, applications: 0, documents: 0 },
        { month: "Feb", students: 0, applications: 0, documents: 0 },
        { month: "Mar", students: 0, applications: 0, documents: 0 },
        { month: "Apr", students: 0, applications: 0, documents: 0 },
        { month: "May", students: 0, applications: 0, documents: 0 },
        { month: "Jun", students: 0, applications: 0, documents: 0 },
      ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-8">
      {/* HEADER */}
      <div>
        <h2 className="text-xl font-semibold">Monthly Trends</h2>
        <p className="text-sm text-slate-500">
          Student registrations, applications, and document processing over
          time.
        </p>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {chartData.map((item) => (
          <div
            key={item.month}
            className="bg-slate-50 rounded-xl p-4 text-center border border-slate-100 hover:shadow-md transition"
          >
            <p className="text-sm text-slate-500">{item.month}</p>

            <p className="text-lg font-semibold mt-2">{item.students}</p>
            <p className="text-xs text-slate-500">Students</p>

            <p className="text-green-600 font-medium mt-2">
              {item.applications}
            </p>
            <p className="text-xs text-slate-500">Applications</p>

            <p className="text-blue-600 font-medium mt-2">{item.documents}</p>
            <p className="text-xs text-slate-500">Documents</p>
          </div>
        ))}
      </div>

      {/* GRAPH */}
      <div className="h-350px w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
              }}
            />
            <Legend />

            <Line
              type="monotone"
              dataKey="students"
              stroke="#6366f1"
              strokeWidth={3}
              dot={{ r: 4 }}
              name="Students"
            />
            <Line
              type="monotone"
              dataKey="applications"
              stroke="#16a34a"
              strokeWidth={3}
              dot={{ r: 4 }}
              name="Applications"
            />
            <Line
              type="monotone"
              dataKey="documents"
              stroke="#2563eb"
              strokeWidth={3}
              dot={{ r: 4 }}
              name="Documents"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

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

const data = [
  { month: "Jan", students: 12, applications: 8, documents: 45 },
  { month: "Feb", students: 18, applications: 15, documents: 67 },
  { month: "Mar", students: 22, applications: 18, documents: 89 },
  { month: "Apr", students: 28, applications: 25, documents: 98 },
  { month: "May", students: 34, applications: 31, documents: 112 },
  { month: "Jun", students: 42, applications: 38, documents: 128 },
];

export default function MonthlyTrends() {
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
        {data.map((item) => (
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
          <LineChart data={data}>
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

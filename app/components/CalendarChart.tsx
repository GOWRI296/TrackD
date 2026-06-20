"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function CalendarChart({
  data,
}: {
  data: any[];
}) {
  const chartData = data.map((item) => ({
    ...item,
    date: new Date(item.created_at)
      .toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
      }),
  }));

  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-6">
        Meeting Hours Trend
      </h2>

      <ResponsiveContainer
        width="100%"
        height={400}
      >
        <LineChart data={chartData}>
          <CartesianGrid
            strokeDasharray="3 3"
          />

          <XAxis dataKey="date" />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="meeting_hours"
            stroke="#38bdf8"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
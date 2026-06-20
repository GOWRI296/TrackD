"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
  LabelList,
} from "recharts";

interface ForecastChartProps {
  current: number;
  predicted: number;
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload || !payload.length) return null;

  const point = payload[0];

  return (
    <div
      style={{
        background: "rgba(20, 20, 24, 0.85)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 12,
        padding: "10px 14px",
        boxShadow: "0 16px 32px -16px rgba(0,0,0,0.6)",
      }}
    >
      <p style={{ color: "#86868b", fontSize: 12, marginBottom: 4 }}>
        {point.payload.name}
      </p>
      <p style={{ color: "#f5f5f7", fontSize: 18, fontWeight: 600 }}>
        {point.value}
        <span style={{ color: "#86868b", fontSize: 12, fontWeight: 400 }}>
          {" "}
          / 100
        </span>
      </p>
    </div>
  );
}

export default function ForecastChart({ current, predicted }: ForecastChartProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(false);
    const frame = requestAnimationFrame(() => setIsVisible(true));
    return () => cancelAnimationFrame(frame);
  }, [current, predicted]);

  const data = [
    { name: "Current", score: current },
    { name: "Predicted", score: predicted },
  ];

  const delta = predicted - current;
  const deltaLabel =
    delta === 0 ? "No change forecasted" : `${delta > 0 ? "+" : ""}${delta} forecasted`;

  return (
    <div className="card chart-card mt-8" style={{ minHeight: 460 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 24,
          position: "relative",
          zIndex: 1,
        }}
      >
        <div>
          <h2 className="text-2xl font-bold">Productivity Forecast</h2>
          <p style={{ color: "#86868b", fontSize: 14, marginTop: 4 }}>
            Where you stand vs. where you're headed
          </p>
        </div>

        <div
          className={delta >= 0 ? "delta-pill delta-up" : "delta-pill delta-down"}
        >
          {delta >= 0 ? "↑" : "↓"} {deltaLabel}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={340}>
        <BarChart data={data} margin={{ top: 24, right: 8, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id="forecastCurrent" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#86868b" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#86868b" stopOpacity={0.35} />
            </linearGradient>
            <linearGradient id="forecastPredicted" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0071e3" stopOpacity={0.95} />
              <stop offset="100%" stopColor="#0071e3" stopOpacity={0.45} />
            </linearGradient>
          </defs>

          <CartesianGrid
            stroke="rgba(255,255,255,0.06)"
            strokeDasharray="0"
            vertical={false}
          />

          <XAxis
            dataKey="name"
            stroke="transparent"
            tick={{ fill: "#86868b", fontSize: 13, fontWeight: 500 }}
            tickLine={false}
            axisLine={false}
          />

          <YAxis
            stroke="transparent"
            tick={{ fill: "#86868b", fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            width={36}
            domain={[0, 100]}
          />

          <Tooltip content={<CustomTooltip />} cursor={false} animationDuration={150} />

          <Bar
            dataKey="score"
            radius={[10, 10, 10, 10]}
            isAnimationActive={isVisible}
            animationDuration={900}
            animationEasing="ease-out"
            maxBarSize={120}
          >
            {data.map((entry, index) => (
              <Cell
                key={entry.name}
                fill={index === 0 ? "url(#forecastCurrent)" : "url(#forecastPredicted)"}
              />
            ))}
            <LabelList
              dataKey="score"
              position="top"
              fill="#f5f5f7"
              fontSize={18}
              fontWeight={600}
              offset={10}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <style jsx global>{`
        .chart-card::after {
          background: radial-gradient(
            600px circle at var(--mx, 50%) var(--my, 50%),
            rgba(0, 113, 227, 0.07),
            transparent 60%
          ) !important;
        }

        .delta-pill {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 6px 12px;
          border-radius: 980px;
          font-size: 13px;
          font-weight: 600;
          white-space: nowrap;
        }

        .delta-up {
          background: rgba(48, 209, 88, 0.12);
          border: 1px solid rgba(48, 209, 88, 0.28);
          color: #30d158;
        }

        .delta-down {
          background: rgba(255, 69, 58, 0.12);
          border: 1px solid rgba(255, 69, 58, 0.28);
          color: #ff453a;
        }
      `}</style>
    </div>
  );
}
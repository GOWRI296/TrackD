"use client";

import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface GithubChartProps {
  data: any[];
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload || !payload.length) return null;

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
      <p style={{ color: "#86868b", fontSize: 12, marginBottom: 4 }}>{label}</p>
      <p style={{ color: "#f5f5f7", fontSize: 18, fontWeight: 600 }}>
        {payload[0].value}
        <span style={{ color: "#86868b", fontSize: 12, fontWeight: 400 }}>
          {" "}
          commits
        </span>
      </p>
    </div>
  );
}

export default function GithubChart({ data }: GithubChartProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(false);
    const frame = requestAnimationFrame(() => setIsVisible(true));
    return () => cancelAnimationFrame(frame);
  }, [data]);

  const chartData = data.map((item) => ({
    ...item,
    date: new Date(item.created_at).toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
    }),
  }));

  const lastIndex = chartData.length - 1;
  const latest = chartData[lastIndex]?.github_activity ?? 0;
  const previous = chartData[lastIndex - 1]?.github_activity ?? latest;
  const delta = latest - previous;
  const deltaLabel =
    delta === 0 ? "No change" : `${delta > 0 ? "+" : ""}${delta} vs previous`;

  function renderDot(props: any) {
    const { cx, cy, index } = props;

    if (index !== lastIndex) {
      return (
        <circle
          key={`dot-${index}`}
          cx={cx}
          cy={cy}
          r={3}
          fill="#0a0a0c"
          stroke="#0071e3"
          strokeWidth={2}
        />
      );
    }

    return (
      <g key={`dot-${index}`}>
        <circle cx={cx} cy={cy} r={5} fill="#0071e3" className="latest-dot-core" />
        <circle
          cx={cx}
          cy={cy}
          r={5}
          fill="none"
          stroke="#0071e3"
          strokeWidth={2}
          className="latest-dot-pulse"
        />
      </g>
    );
  }

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
          <h2 className="text-2xl font-bold">GitHub Activity Trend</h2>
          <p style={{ color: "#86868b", fontSize: 14, marginTop: 4 }}>
            Commits and contributions over time
          </p>
        </div>

        <div
          className={delta >= 0 ? "delta-pill delta-up" : "delta-pill delta-down"}
        >
          {delta >= 0 ? "↑" : "↓"} {deltaLabel}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={380}>
        <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id="githubFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0071e3" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#0071e3" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid
            stroke="rgba(255,255,255,0.06)"
            strokeDasharray="0"
            vertical={false}
          />

          <XAxis
            dataKey="date"
            stroke="transparent"
            tick={{ fill: "#86868b", fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />

          <YAxis
            stroke="transparent"
            tick={{ fill: "#86868b", fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            width={36}
          />

          <Tooltip
            content={<CustomTooltip />}
            cursor={{ stroke: "rgba(255,255,255,0.15)", strokeWidth: 1 }}
            animationDuration={150}
          />

          <Area
            type="monotone"
            dataKey="github_activity"
            stroke="#0071e3"
            strokeWidth={2.5}
            fill="url(#githubFill)"
            dot={renderDot}
            activeDot={{ r: 6, stroke: "#0071e3", strokeWidth: 2, fill: "#0a0a0c" }}
            isAnimationActive={isVisible}
            animationDuration={1300}
            animationEasing="ease-out"
          />
        </AreaChart>
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

        .latest-dot-pulse {
          transform-box: fill-box;
          transform-origin: center;
          animation: chart-pulse-ring 1.8s ease-out infinite;
        }

        .latest-dot-core {
          transform-box: fill-box;
          transform-origin: center;
          animation: chart-pulse-core 1.8s ease-out infinite;
        }

        @keyframes chart-pulse-ring {
          0% {
            transform: scale(1);
            opacity: 0.9;
          }
          70%,
          100% {
            transform: scale(2.8);
            opacity: 0;
          }
        }

        @keyframes chart-pulse-core {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.15);
          }
        }
      `}</style>
    </div>
  );
}
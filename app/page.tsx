import UserProfileCard from "./components/UserProfileCard";
import supabase from "../lib/supabase";
import ProductivityChart from "./components/ProductivityChart";
import Sidebar from "./components/Sidebar";
import GithubLiveStats from "./components/GithubLiveStats";
import CalendarLiveStats from "./components/CalendarLiveStats";
import NotificationCard from "./components/NotificationCard";

export const dynamic = "force-dynamic";

function applyHarshCurve(rawScore: number): number {
  const normalized = Math.max(0, Math.min(100, rawScore)) / 100;
  const curved = Math.pow(normalized, 1.8);
  return Math.round(curved * 100);
}

interface PerformanceLevel {
  trend: string;
  trendAngle: number;
  burnoutRisk: string;
  insight: string;
}

function getPerformanceLevel(score: number): PerformanceLevel {
  if (score >= 95) return { trend: "Elite", trendAngle: -55, burnoutRisk: "Low", insight: "This is what consistent execution looks like. Don't get comfortable — this bar is the new minimum, not a peak." };
  if (score >= 85) return { trend: "Strong", trendAngle: -35, burnoutRisk: "Low", insight: "Solid work. You're operating above average, but there's a real gap between this and elite. Close it." };
  if (score >= 70) return { trend: "Inconsistent", trendAngle: 0, burnoutRisk: "Moderate", insight: "You're getting by, not getting ahead. This score reflects effort that comes and goes. Pick a standard and hold it daily." };
  if (score >= 50) return { trend: "Weak", trendAngle: 35, burnoutRisk: "High", insight: "Reality check: this is below what the work requires. Excuses aside, the output isn't there. Something needs to change today, not next week." };
  if (score >= 25) return { trend: "Falling Behind", trendAngle: 55, burnoutRisk: "High", insight: "This is a pattern, not a bad day. At this level you are actively losing ground. Stop tracking and start fixing." };
  return { trend: "Critical", trendAngle: 80, burnoutRisk: "Extreme", insight: "This is a crisis-level score. Whatever you're doing right now isn't working. A complete reset is overdue — not optional." };
}

function getGrade(score: number): string {
  if (score >= 99) return "S";
  if (score >= 95) return "A";
  if (score >= 85) return "B";
  if (score >= 70) return "C";
  if (score >= 50) return "D";
  return "F";
}

function getDeadlineRisk(score: number): string {
  if (score >= 85) return "Low";
  if (score >= 60) return "Moderate";
  return "High";
}

export default async function Home() {
  const { data } = await supabase
    .from("daily_metrics")
    .select("*")
    .order("created_at", { ascending: false });

  const metric = data?.[0];
  const rawScore = metric?.productivity_score ?? 0;
  const score = applyHarshCurve(rawScore);
  const { trend, trendAngle, burnoutRisk, insight } = getPerformanceLevel(score);
  const grade = getGrade(score);
  const deadlineRisk = metric?.deadline_risk ?? getDeadlineRisk(score);

  const curvedChartData = (data || []).map((item) => ({
    ...item,
    productivity_score: applyHarshCurve(item.productivity_score ?? 0),
  }));

  return (
    <>
      <Sidebar />

      {/* Fixed background layers — z-index 0, behind everything */}
      <div className="dash-bg-wrap">
        <span className="dash-bg-text">TRACKD AI</span>
      </div>
      <div className="dash-overlay" />

      {/* Blobs — also fixed behind */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        <div className="blob blob1" />
        <div className="blob blob2" />
        <div className="blob blob3" />
      </div>

      {/*
        CRITICAL: no transform, filter, or will-change on this element —
        those create a new stacking context that breaks backdrop-filter on children
      */}
      <main
        style={{
          position: "relative",
          zIndex: 1,
          minHeight: "100vh",
          padding: "40px",
          marginLeft: "16rem",
          width: "calc(100vw - 16rem)",
        }}
      >
        <div className="fixed top-6 right-6 z-50">
          <UserProfileCard />
        </div>
        <NotificationCard />

        <div style={{ marginBottom: "40px" }}>
          <h1 className="dash-title">TrackD AI</h1>
          <p className="dash-sub">Productivity &amp; Workload Analytics Platform</p>
        </div>

        {/* No transform/filter/opacity on grid wrappers — kills backdrop-filter */}
        <div className="grid lg:grid-cols-6 md:grid-cols-2 gap-5">
          <GithubLiveStats />
          <CalendarLiveStats />
          <div className="card">
            <p className="metric-title">Deadline Risk</p>
            <div style={{ marginTop: "16px" }}>
              <span className="badge">{deadlineRisk}</span>
            </div>
          </div>
          <div className="card">
            <p className="metric-title">Performance Grade</p>
            <h2 className="metric-value">{grade}</h2>
          </div>
          <div className="card">
            <p className="metric-title">Trend Direction</p>
            <div
              style={{
                position: "relative",
                zIndex: 1,
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginTop: "16px",
              }}
            >
              <svg
                width="36"
                height="36"
                viewBox="0 0 44 44"
                style={{ flexShrink: 0, overflow: "visible" }}
              >
                {/* static compass ring + center dot, holds rotation angle */}
                <circle cx="22" cy="22" r="20" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
                <g style={{ transform: `rotate(${trendAngle}deg)`, transformOrigin: "22px 22px" }}>
                  {/* animated child group: entrance + wobble, doesn't fight the angle above */}
                  <g className="compass-needle">
                    <polygon points="22,8 26,22 22,19 18,22" fill="#5ec8f8" />
                    <polygon points="22,36 26,22 22,25 18,22" fill="rgba(255,255,255,0.25)" />
                  </g>
                </g>
                <circle cx="22" cy="22" r="2.2" fill="rgba(255,255,255,0.55)" />
              </svg>
              <h2 className="trend-value">{trend}</h2>
            </div>
          </div>
        </div>

        <div style={{ marginTop: "24px" }}>
          <ProductivityChart data={curvedChartData} />
        </div>

        <div className="grid md:grid-cols-2 gap-5" style={{ marginTop: "24px" }}>
          <div className="card">
            <p className="metric-title">Burnout Risk</p>
            <div style={{ marginTop: "16px" }}>
              <span className="badge badge-warning">{burnoutRisk}</span>
            </div>
          </div>
          <div className="card">
            <p className="metric-title">Predicted Productivity</p>
            <h2 className="metric-value">{metric?.predicted_score ?? 0}</h2>
          </div>
        </div>

        <div className="card" style={{ marginTop: "24px" }}>
          <h2 className="insight-title">AI Insights</h2>
          <p className="insight-body">{insight}</p>
        </div>
      </main>

      <style>{`
        .dash-bg-wrap {
          position: fixed;
          inset: 0;
          z-index: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          pointer-events: none;
        }
        .dash-bg-text {
          font-size: clamp(80px, 18vw, 260px);
          font-weight: 800;
          letter-spacing: -0.02em;
          white-space: nowrap;
          line-height: 1;
          animation: dash-color-cycle 10s ease-in-out infinite,
                     dash-pulse 6s ease-in-out infinite;
        }
        @keyframes dash-color-cycle {
          0%   { color: #1a2744; }
          20%  { color: #0a3d6b; }
          40%  { color: #0d5a8a; }
          60%  { color: #083d4a; }
          80%  { color: #3d2200; }
          100% { color: #1a2744; }
        }
        @keyframes dash-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.8; transform: scale(1.02); }
        }
        .dash-overlay {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          background: radial-gradient(ellipse 85% 75% at 50% 50%,
            rgba(10,10,12,0.0) 0%,
            rgba(10,10,12,0.20) 55%,
            rgba(10,10,12,0.60) 100%);
        }
        .dash-title {
          font-size: 44px;
          font-weight: 700;
          letter-spacing: -0.03em;
          background: linear-gradient(135deg, #f5f5f7 0%, #86868b 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .dash-sub {
          color: rgba(255,255,255,0.35);
          font-size: 16px;
          margin-top: 6px;
        }
        .insight-title {
          position: relative;
          z-index: 1;
          font-size: 18px;
          font-weight: 600;
          color: rgba(255,255,255,0.92);
          margin-bottom: 12px;
        }
        .insight-body {
          position: relative;
          z-index: 1;
          color: rgba(255,255,255,0.45);
          font-size: 15px;
          line-height: 1.8;
        }
        .compass-needle {
          transform-origin: 22px 22px;
          animation: compass-swing 2.4s ease-in-out infinite;
        }
        @keyframes compass-swing {
          0%   { transform: rotate(-12deg); filter: drop-shadow(0 0 0px rgba(94,200,248,0)); }
          50%  { transform: rotate(12deg);  filter: drop-shadow(0 0 5px rgba(94,200,248,0.65)); }
          100% { transform: rotate(-12deg); filter: drop-shadow(0 0 0px rgba(94,200,248,0)); }
        }
        .trend-value {
          position: relative;
          z-index: 1;
          font-size: 22px;
          font-weight: 700;
          margin: 0;
          color: rgba(255,255,255,0.92);
          animation: trend-fade 0.6s ease-out;
        }
        @keyframes trend-fade {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .dash-bg-text, .compass-needle { animation: none !important; }
          .dash-bg-text { opacity: 0.8; color: #0a3d6b; }
        }
      `}</style>
    </>
  );
}
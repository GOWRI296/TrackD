import { createSupabaseServerClient } from "../../lib/supabase-server";
import ForecastChart from "../components/ForecastChart";
import Sidebar from "../components/Sidebar";

export default async function InsightsPage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data } = await supabase
    .from("daily_metrics")
    .select("*")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false })
    .limit(5);

  const latest = data?.[0];
  const history = data?.slice(1) || [];

  return (
    <>
      <Sidebar />

      {/* Same background as dashboard */}
      <div className="dash-bg-wrap">
        <span className="dash-bg-text">INSIGHTS</span>
      </div>
      <div className="dash-overlay" />
      <div style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden", pointerEvents: "none" }}>
        <div className="blob blob1" />
        <div className="blob blob2" />
        <div className="blob blob3" />
      </div>

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
        {/* Header */}
        <div style={{ marginBottom: "36px" }}>
          <h1 className="dash-title">AI Insights</h1>
          <p className="dash-sub">AI-powered productivity intelligence and recommendations.</p>
        </div>

        {/* KPI Cards */}
        <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-5" style={{ marginBottom: "28px" }}>
          <div className="card">
            <p className="metric-title">Burnout Risk</p>
            <h2 className="metric-value">{latest?.burnout_risk ?? "Low"}</h2>
          </div>

          <div className="card">
            <p className="metric-title">Predicted Productivity</p>
            <h2 className="metric-value">{latest?.predicted_score ?? 0}</h2>
          </div>

          <div className="card">
            <p className="metric-title">Meeting Hours</p>
            <h2 className="metric-value">{latest?.meeting_hours ?? 0}</h2>
          </div>

          <div className="card">
            <p className="metric-title">Upcoming Events</p>
            <h2 className="metric-value">{latest?.upcoming_events ?? 0}</h2>
          </div>
        </div>

        {/* Gemini Report */}
        <div className="card" style={{ marginBottom: "28px" }}>
          <h2 className="ins-section-title">Gemini AI Recommendation</h2>

          <div className="ins-report-box">
            <p className="ins-report-text">
              {latest?.ai_report ?? "No AI recommendations available."}
            </p>
          </div>
        </div>

        {/* Forecast Chart */}
        <div style={{ marginBottom: "28px" }}>
          <ForecastChart
            current={latest?.productivity_score ?? 0}
            predicted={latest?.predicted_score ?? 0}
          />
        </div>

        {/* AI Report History */}
        <div className="card">
          <h2 className="ins-section-title-sm">Previous AI Assessments</h2>

          <div className="ins-history-list">
            {history.map((item, index) => (
              <div key={index} className="ins-history-item">
                <p className="ins-history-date">
                  {new Date(item.created_at).toLocaleDateString()}
                </p>
                <p className="ins-history-text">{item.ai_report}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <style>{`
        /* Reuse dashboard background styles */
        .dash-bg-wrap {
          position: fixed; inset: 0; z-index: 0;
          display: flex; align-items: center; justify-content: center;
          overflow: hidden; pointer-events: none;
        }
        .dash-bg-text {
          font-size: clamp(100px, 22vw, 320px);
          font-weight: 800; letter-spacing: -0.02em;
          white-space: nowrap; line-height: 1;
          animation: dash-color-cycle 10s ease-in-out infinite,
                     dash-pulse 6s ease-in-out infinite;
        }
        @keyframes dash-color-cycle {
          0%   { color: #0d1b3e; } 20% { color: #0a3d6b; }
          40%  { color: #0d5a8a; } 60% { color: #083d4a; }
          80%  { color: #1a0a2e; } 100%{ color: #0d1b3e; }
        }
        @keyframes dash-pulse {
          0%,100%{ opacity:1; transform:scale(1); }
          50%    { opacity:0.8; transform:scale(1.02); }
        }
        .dash-overlay {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background: radial-gradient(ellipse 85% 75% at 50% 50%,
            rgba(10,10,12,0.0) 0%, rgba(10,10,12,0.15) 50%, rgba(10,10,12,0.55) 100%);
        }
        .dash-title {
          font-size: 42px; font-weight: 700; letter-spacing: -0.03em;
          background: linear-gradient(135deg, #f5f5f7 0%, #86868b 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .dash-sub { color: rgba(255,255,255,0.35); font-size: 15px; margin-top: 6px; }

        /* Section titles inside cards */
        .ins-section-title {
          font-size: 22px; font-weight: 700; letter-spacing: -0.01em;
          color: #f5f5f7; margin-bottom: 18px;
        }
        .ins-section-title-sm {
          font-size: 18px; font-weight: 700; letter-spacing: -0.01em;
          color: #f5f5f7; margin-bottom: 18px;
        }

        /* Gemini report box */
        .ins-report-box {
          background: rgba(8, 12, 24, 0.55);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          padding: 22px;
        }
        .ins-report-text {
          font-size: 15px; line-height: 1.8;
          color: rgba(255,255,255,0.65);
          white-space: pre-line;
        }

        /* History list */
        .ins-history-list {
          display: flex; flex-direction: column; gap: 12px;
        }
        .ins-history-item {
          background: rgba(8, 12, 24, 0.5);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          padding: 16px 18px;
        }
        .ins-history-date {
          font-size: 11px; font-weight: 600;
          color: rgba(255,255,255,0.3);
          text-transform: uppercase; letter-spacing: 0.06em;
          margin-bottom: 8px;
        }
        .ins-history-text {
          font-size: 14px; line-height: 1.7;
          color: rgba(255,255,255,0.55);
        }

        @media (prefers-reduced-motion: reduce) {
          .dash-bg-text { animation: none !important; }
        }
      `}</style>
    </>
  );
}
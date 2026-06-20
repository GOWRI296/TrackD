import supabase from "../../lib/supabase";
import GithubChart from "../components/GithubChart";
import GithubLiveStats from "../components/GithubLiveStats";
import Sidebar from "../components/Sidebar";

export default async function GithubPage() {
  const { data } = await supabase
    .from("daily_metrics")
    .select("*")
    .order("created_at", { ascending: false });

  const latest = data?.[0];

  // Build activity timeline from real data
  const activityItems = (data || []).slice(0, 8).map((item, i) => ({
    type: i % 3 === 0 ? "commit" : i % 3 === 1 ? "push" : "review",
    message:
      i % 3 === 0
        ? `Pushed ${item.github_activity ?? 0} commits`
        : i % 3 === 1
        ? `Activity score ${item.productivity_score ?? 0}`
        : `Session logged`,
    time: new Date(item.created_at).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    score: item.productivity_score ?? 0,
  }));

  return (
    <>
      <Sidebar />

      {/* Same background as dashboard */}
      <div className="dash-bg-wrap">
        <span className="dash-bg-text">GITHUB</span>
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
          <h1 className="dash-title">GitHub Analytics</h1>
          <p className="dash-sub">Repository activity and productivity insights.</p>
        </div>

        {/* Top stat cards */}
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5" style={{ marginBottom: "28px" }}>
          <GithubLiveStats />
          <div className="card">
            <p className="metric-title">GitHub Activity</p>
            <h2 className="metric-value">{latest?.github_activity ?? 0}</h2>
          </div>
          <div className="card">
            <p className="metric-title">Productivity Score</p>
            <h2 className="metric-value">
              {Math.round((latest?.productivity_score ?? 0) * 0.6)}
            </h2>
          </div>
        </div>

        {/* Main layout — chart + left panel */}
        <div className="gh-layout">

          {/* LEFT PANEL — Activity Feed + Stats */}
          <div className="gh-left">

            {/* Terminal activity feed */}
            <div className="gh-terminal">
              <div className="gh-terminal-header">
                <div className="gh-dot gh-dot-red" />
                <div className="gh-dot gh-dot-yellow" />
                <div className="gh-dot gh-dot-green" />
                <span className="gh-terminal-title">activity.log</span>
                <span className="gh-live-badge">
                  <span className="gh-live-dot" />
                  LIVE
                </span>
              </div>

              <div className="gh-terminal-body">
                {activityItems.length > 0 ? (
                  activityItems.map((item, i) => (
                    <div
                      key={i}
                      className="gh-log-row"
                      style={{ animationDelay: `${i * 0.08}s` }}
                    >
                      <span className="gh-log-time">{item.time}</span>
                      <span
                        className={`gh-log-type gh-log-type-${item.type}`}
                      >
                        [{item.type}]
                      </span>
                      <span className="gh-log-msg">{item.message}</span>
                      <span
                        className={`gh-log-score ${
                          item.score >= 70
                            ? "gh-score-good"
                            : item.score >= 40
                            ? "gh-score-mid"
                            : "gh-score-low"
                        }`}
                      >
                        {item.score}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="gh-log-empty">
                    <span className="gh-log-cursor">▊</span>
                    <span style={{ color: "rgba(255,255,255,0.3)" }}>
                      No activity logged yet...
                    </span>
                  </div>
                )}

                {/* Scrolling cursor */}
                <div className="gh-cursor-row">
                  <span className="gh-log-cursor">▊</span>
                </div>
              </div>
            </div>

            {/* Contribution heatmap — visual only, generated from data */}
            <div className="gh-heatmap-card">
              <p className="gh-heatmap-title">Contribution Density</p>
              <div className="gh-heatmap">
                {Array.from({ length: 70 }).map((_, i) => {
                  const dataPoint = (data || [])[i % (data?.length || 1)];
                  const val = dataPoint?.github_activity ?? 0;
                  const level =
                    val >= 10 ? 4 : val >= 7 ? 3 : val >= 4 ? 2 : val >= 1 ? 1 : 0;
                  return (
                    <div
                      key={i}
                      className={`gh-heat-cell gh-heat-${level}`}
                      title={`Activity: ${val}`}
                    />
                  );
                })}
              </div>
              <div className="gh-heatmap-legend">
                <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px" }}>Less</span>
                {[0, 1, 2, 3, 4].map((l) => (
                  <div key={l} className={`gh-heat-cell gh-heat-${l}`} />
                ))}
                <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px" }}>More</span>
              </div>
            </div>
          </div>

          {/* RIGHT — Chart */}
          <div className="gh-chart">
            <GithubChart data={[...(data || [])].reverse()} />
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

        /* Layout */
        .gh-layout {
          display: grid;
          grid-template-columns: 320px 1fr;
          gap: 20px;
          align-items: start;
        }
        .gh-left {
          display: flex; flex-direction: column; gap: 14px;
        }

        /* Terminal */
        .gh-terminal {
          background: rgba(8, 12, 24, 0.75);
          backdrop-filter: blur(24px) saturate(160%);
          -webkit-backdrop-filter: blur(24px) saturate(160%);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          overflow: hidden;
        }
        .gh-terminal-header {
          display: flex; align-items: center; gap: 8px;
          padding: 12px 16px;
          background: rgba(255,255,255,0.03);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .gh-dot { width: 10px; height: 10px; border-radius: 50%; }
        .gh-dot-red    { background: #ff5f56; }
        .gh-dot-yellow { background: #ffbd2e; }
        .gh-dot-green  { background: #27c93f; }
        .gh-terminal-title {
          font-size: 11px; font-weight: 500;
          color: rgba(255,255,255,0.35);
          margin-left: 4px; flex: 1;
          font-family: 'SF Mono', 'Fira Code', monospace;
        }
        .gh-live-badge {
          display: flex; align-items: center; gap: 5px;
          font-size: 10px; font-weight: 700;
          color: #30d158; letter-spacing: 0.08em;
        }
        .gh-live-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #30d158; box-shadow: 0 0 5px #30d158;
          animation: blink 1.5s ease-in-out infinite;
        }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.2} }

        .gh-terminal-body {
          padding: 14px 16px;
          display: flex; flex-direction: column; gap: 8px;
          max-height: 260px; overflow-y: auto;
          font-family: 'SF Mono', 'Fira Code', 'Courier New', monospace;
        }
        .gh-terminal-body::-webkit-scrollbar { width: 3px; }
        .gh-terminal-body::-webkit-scrollbar-track { background: transparent; }
        .gh-terminal-body::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }

        .gh-log-row {
          display: flex; align-items: center; gap: 8px;
          font-size: 11.5px; line-height: 1.4;
          animation: log-in 0.4s ease-out both;
        }
        @keyframes log-in { from{opacity:0;transform:translateX(-6px)} to{opacity:1;transform:translateX(0)} }
        .gh-log-time  { color: rgba(255,255,255,0.25); font-size: 10px; white-space: nowrap; min-width: 44px; }
        .gh-log-type  { font-size: 10px; font-weight: 700; white-space: nowrap; }
        .gh-log-type-commit { color: #5ac8fa; }
        .gh-log-type-push   { color: #30d158; }
        .gh-log-type-review { color: #ff9f0a; }
        .gh-log-msg   { color: rgba(255,255,255,0.55); flex: 1; font-size: 11px; }
        .gh-log-score { font-size: 10px; font-weight: 700; padding: 1px 6px; border-radius: 4px; }
        .gh-score-good { background: rgba(48,209,88,0.15); color: #30d158; }
        .gh-score-mid  { background: rgba(255,159,10,0.15); color: #ff9f0a; }
        .gh-score-low  { background: rgba(255,69,58,0.15);  color: #ff453a; }
        .gh-log-empty  { display: flex; align-items: center; gap: 8px; color: rgba(255,255,255,0.2); font-size: 12px; }
        .gh-cursor-row { display: flex; align-items: center; }
        .gh-log-cursor {
          color: #5ac8fa; font-size: 13px;
          animation: cursor-blink 1s step-end infinite;
        }
        @keyframes cursor-blink { 0%,100%{opacity:1} 50%{opacity:0} }

        /* Heatmap */
        .gh-heatmap-card {
          background: rgba(15, 20, 40, 0.55);
          backdrop-filter: blur(24px) saturate(160%);
          -webkit-backdrop-filter: blur(24px) saturate(160%);
          border-top: 1px solid rgba(255,255,255,0.12);
          border-left: 1px solid rgba(255,255,255,0.08);
          border-right: 1px solid rgba(255,255,255,0.04);
          border-bottom: 1px solid rgba(255,255,255,0.03);
          border-radius: 16px;
          padding: 18px 20px;
        }
        .gh-heatmap-title {
          font-size: 11px; font-weight: 600;
          color: rgba(255,255,255,0.38);
          text-transform: uppercase; letter-spacing: 0.08em;
          margin-bottom: 12px;
        }
        .gh-heatmap {
          display: grid;
          grid-template-columns: repeat(14, 1fr);
          gap: 4px;
        }
        .gh-heat-cell {
          aspect-ratio: 1;
          border-radius: 3px;
          transition: transform 0.15s ease;
          cursor: default;
        }
        .gh-heat-cell:hover { transform: scale(1.3); }
        .gh-heat-0 { background: rgba(255,255,255,0.05); }
        .gh-heat-1 { background: rgba(48,209,88,0.20); }
        .gh-heat-2 { background: rgba(48,209,88,0.40); }
        .gh-heat-3 { background: rgba(48,209,88,0.65); }
        .gh-heat-4 { background: rgba(48,209,88,0.90); box-shadow: 0 0 4px rgba(48,209,88,0.5); }
        .gh-heatmap-legend {
          display: flex; align-items: center; gap: 4px;
          margin-top: 10px; justify-content: flex-end;
        }
        .gh-heatmap-legend .gh-heat-cell { width: 10px; height: 10px; }

        /* Chart side */
        .gh-chart { min-width: 0; }

        @media (max-width: 900px) {
          .gh-layout { grid-template-columns: 1fr; }
        }
        @media (prefers-reduced-motion: reduce) {
          .dash-bg-text, .gh-log-row, .gh-live-dot, .gh-log-cursor { animation: none !important; }
        }
      `}</style>
    </>
  );
}
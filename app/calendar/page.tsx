import supabase from "../../lib/supabase";
import CalendarChart from "../components/CalendarChart";
import CalendarLiveStats from "../components/CalendarLiveStats";
import Sidebar from "../components/Sidebar";

export default async function CalendarPage() {
  const { data } = await supabase
    .from("daily_metrics")
    .select("*")
    .order("created_at", { ascending: false });

  const latest = data?.[0];

  const totalMeetingHours = (data || []).reduce(
    (sum, item) => sum + (item.meeting_hours ?? 0),
    0
  );
  const avgMeetingHours = data?.length
    ? Math.round(
        ((data || []).reduce((sum, item) => sum + (item.meeting_hours ?? 0), 0) /
          data.length) *
          10
      ) / 10
    : 0;
  const freeDays = (data || []).filter((item) => (item.meeting_hours ?? 0) === 0).length;

  // Weekly load distribution — busiest day of week by avg meeting hours
  const dayBuckets = [0, 0, 0, 0, 0, 0, 0];
  const dayCounts = [0, 0, 0, 0, 0, 0, 0];
  (data || []).forEach((item) => {
    const d = new Date(item.created_at).getDay();
    dayBuckets[d] += item.meeting_hours ?? 0;
    dayCounts[d] += 1;
  });
  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dayAverages = dayBuckets.map((total, i) =>
    dayCounts[i] ? total / dayCounts[i] : 0
  );
  const maxDayAvg = Math.max(...dayAverages, 1);

  return (
    <>
      <Sidebar />

      {/* Same background as dashboard */}
      <div className="dash-bg-wrap">
        <span className="dash-bg-text">CALENDAR</span>
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
          <h1 className="dash-title">Calendar Analytics</h1>
          <p className="dash-sub">Meeting workload and scheduling intelligence.</p>
        </div>

        {/* Top stat cards */}
        <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-5" style={{ marginBottom: "28px" }}>
          <CalendarLiveStats />
          <div className="card">
            <p className="metric-title">Meeting Hours</p>
            <h2 className="metric-value">{latest?.meeting_hours ?? 0}</h2>
          </div>
          <div className="card">
            <p className="metric-title">Burnout Risk</p>
            <h2 className="metric-value">{latest?.burnout_risk ?? "Low"}</h2>
          </div>
          <div className="card">
            <p className="metric-title">Deadline Risk</p>
            <h2 className="metric-value">{latest?.deadline_risk ?? "Low"}</h2>
          </div>
        </div>

        {/* Main layout — chart + right panel */}
        <div className="cal-layout">

          {/* LEFT — Chart */}
          <div className="cal-chart">
            <CalendarChart data={[...(data || [])].reverse()} />
          </div>

          {/* RIGHT PANEL — Stats + Weekly Load */}
          <div className="cal-right">

            {/* Quick stats strip */}
            <div className="cal-stats-strip">
              <div className="cal-stat">
                <span className="cal-stat-val">{totalMeetingHours}h</span>
                <span className="cal-stat-lbl">Total Hours</span>
              </div>
              <div className="cal-stat-divider" />
              <div className="cal-stat">
                <span className="cal-stat-val">{avgMeetingHours}h</span>
                <span className="cal-stat-lbl">Avg / Day</span>
              </div>
              <div className="cal-stat-divider" />
              <div className="cal-stat">
                <span className="cal-stat-val">{freeDays}d</span>
                <span className="cal-stat-lbl">Free Days</span>
              </div>
            </div>

            {/* Weekly load distribution — visual only, generated from data */}
            <div className="cal-load-card">
              <p className="cal-load-title">Weekly Load Distribution</p>
              <div className="cal-load-bars">
                {dayAverages.map((avg, i) => {
                  const heightPct = Math.max((avg / maxDayAvg) * 100, 4);
                  const level =
                    avg >= 6 ? 4 : avg >= 4 ? 3 : avg >= 2 ? 2 : avg > 0 ? 1 : 0;
                  return (
                    <div key={i} className="cal-load-col">
                      <div className="cal-load-track">
                        <div
                          className={`cal-load-fill cal-load-${level}`}
                          style={{ height: `${heightPct}%` }}
                          title={`${dayLabels[i]}: avg ${avg.toFixed(1)}h`}
                        />
                      </div>
                      <span className="cal-load-day">{dayLabels[i]}</span>
                    </div>
                  );
                })}
              </div>
            </div>
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
        .cal-layout {
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 20px;
          align-items: start;
        }
        .cal-right {
          display: flex; flex-direction: column; gap: 14px;
        }
        .cal-chart { min-width: 0; }

        /* Stats strip */
        .cal-stats-strip {
          background: rgba(15, 20, 40, 0.55);
          backdrop-filter: blur(24px) saturate(160%);
          -webkit-backdrop-filter: blur(24px) saturate(160%);
          border-top: 1px solid rgba(255,255,255,0.12);
          border-left: 1px solid rgba(255,255,255,0.08);
          border-right: 1px solid rgba(255,255,255,0.04);
          border-bottom: 1px solid rgba(255,255,255,0.03);
          border-radius: 16px;
          padding: 18px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }
        .cal-stat { display: flex; flex-direction: column; align-items: center; gap: 4px; flex: 1; }
        .cal-stat-val { font-size: 26px; font-weight: 700; color: #fff; letter-spacing: -0.02em; }
        .cal-stat-lbl { font-size: 10px; font-weight: 500; color: rgba(255,255,255,0.35); text-transform: uppercase; letter-spacing: 0.07em; }
        .cal-stat-divider { width: 1px; height: 36px; background: rgba(255,255,255,0.08); }

        /* Weekly load distribution */
        .cal-load-card {
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
        .cal-load-title {
          font-size: 11px; font-weight: 600;
          color: rgba(255,255,255,0.38);
          text-transform: uppercase; letter-spacing: 0.08em;
          margin-bottom: 14px;
        }
        .cal-load-bars {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 8px;
          height: 110px;
        }
        .cal-load-col {
          display: flex; flex-direction: column; align-items: center;
          gap: 6px; flex: 1; height: 100%;
        }
        .cal-load-track {
          flex: 1; width: 100%;
          display: flex; align-items: flex-end;
          background: rgba(255,255,255,0.04);
          border-radius: 4px;
          overflow: hidden;
        }
        .cal-load-fill {
          width: 100%;
          border-radius: 4px 4px 0 0;
          transition: transform 0.15s ease;
        }
        .cal-load-col:hover .cal-load-fill { transform: scaleX(1.15); }
        .cal-load-0 { background: rgba(255,255,255,0.06); }
        .cal-load-1 { background: rgba(90,200,250,0.35); }
        .cal-load-2 { background: rgba(90,200,250,0.55); }
        .cal-load-3 { background: rgba(255,159,10,0.65); }
        .cal-load-4 { background: rgba(255,69,58,0.75); box-shadow: 0 0 4px rgba(255,69,58,0.4); }
        .cal-load-day {
          font-size: 10px; font-weight: 600;
          color: rgba(255,255,255,0.35);
          text-transform: uppercase; letter-spacing: 0.04em;
        }

        @media (max-width: 900px) {
          .cal-layout { grid-template-columns: 1fr; }
        }
        @media (prefers-reduced-motion: reduce) {
          .dash-bg-text { animation: none !important; }
        }
      `}</style>
    </>
  );
}
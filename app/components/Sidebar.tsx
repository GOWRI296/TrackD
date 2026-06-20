"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import supabase from "../../lib/supabase";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  async function logout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  const links = [
    { href: "/", label: "Dashboard" },
    { href: "/github", label: "GitHub Analytics" },
    { href: "/calendar", label: "Calendar Analytics" },
    { href: "/insights", label: "AI Insights" },
    { href: "/weekly-review", label: "Weekly Review" },
    { href: "/what-if", label: "What-If Analysis" },
  ];

  return (
    <>
      <aside className="sidebar">
        <div className="sidebar-top">
          <div className="sidebar-brand">
            <h1 className="sidebar-logo">TrackD AI</h1>
            <p className="sidebar-tagline">Productivity Intelligence</p>
          </div>

          <nav className="sidebar-nav">
            {links.map(({ href, label }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`sidebar-link ${active ? "sidebar-link-active" : ""}`}
                >
                  <span className="sidebar-link-indicator" />
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="sidebar-bottom">
          <div className="sidebar-status-card">
            <p className="sidebar-status-label">USER STATUS</p>
            <p className="sidebar-status-value">
              <span className="sidebar-dot" />
              Online
            </p>
          </div>

          <button onClick={logout} className="sidebar-logout">
            Logout
          </button>
        </div>
      </aside>

      <style>{`
        .sidebar {
          position: fixed;
          left: 0; top: 0;
          height: 100vh;
          width: 16rem;
          z-index: 40;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 28px 20px;

          /* Pure glass — same as cards */
          background: rgba(255, 255, 255, 0.01);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);

          border-top: none;
          border-left: none;
          border-bottom: none;
          border-right: 1px solid rgba(255, 255, 255, 0.08);
        }

        /* Subtle right-edge glint */
        .sidebar::before {
          content: "";
          position: absolute;
          top: 0; right: 0;
          width: 1px; height: 100%;
          background: linear-gradient(180deg,
            rgba(255,255,255,0) 0%,
            rgba(255,255,255,0.18) 30%,
            rgba(255,255,255,0.18) 70%,
            rgba(255,255,255,0) 100%);
          pointer-events: none;
        }

        /* Inner top sheen */
        .sidebar::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(160deg,
            rgba(255,255,255,0.04) 0%,
            rgba(255,255,255,0) 40%);
          pointer-events: none;
        }

        .sidebar-top { display: flex; flex-direction: column; gap: 0; }

        .sidebar-brand { margin-bottom: 40px; }

        .sidebar-logo {
          font-size: 22px;
          font-weight: 700;
          letter-spacing: -0.02em;
          color: rgba(255,255,255,0.92);
          background: linear-gradient(135deg, #f5f5f7 0%, #5ac8fa 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .sidebar-tagline {
          font-size: 12px;
          color: rgba(255,255,255,0.28);
          margin-top: 4px;
          letter-spacing: 0.02em;
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .sidebar-link {
          position: relative;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 500;
          color: rgba(255,255,255,0.38);
          text-decoration: none;
          transition: color 0.25s ease, background 0.25s ease;
        }

        .sidebar-link:hover {
          color: rgba(255,255,255,0.85);
          background: rgba(255,255,255,0.04);
        }

        .sidebar-link-active {
          color: rgba(255,255,255,0.92) !important;
          background: rgba(255,255,255,0.06) !important;
          border: 1px solid rgba(255,255,255,0.10);
        }

        .sidebar-link-indicator {
          width: 3px;
          height: 16px;
          border-radius: 2px;
          background: transparent;
          transition: background 0.25s ease;
          flex-shrink: 0;
        }

        .sidebar-link-active .sidebar-link-indicator {
          background: #5ac8fa;
          box-shadow: 0 0 8px rgba(90,200,250,0.6);
        }

        /* Bottom section */
        .sidebar-bottom { display: flex; flex-direction: column; gap: 12px; }

        .sidebar-status-card {
          padding: 14px 16px;
          border-radius: 14px;
          background: rgba(255,255,255,0.01);
          border-top: 1px solid rgba(255,255,255,0.12);
          border-left: 1px solid rgba(255,255,255,0.08);
          border-right: 1px solid rgba(255,255,255,0.04);
          border-bottom: 1px solid rgba(255,255,255,0.03);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }

        .sidebar-status-label {
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.08em;
          color: rgba(255,255,255,0.28);
          text-transform: uppercase;
        }

        .sidebar-status-value {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 600;
          color: #30d158;
          margin-top: 6px;
        }

        .sidebar-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: #30d158;
          box-shadow: 0 0 6px #30d158;
          animation: dot-pulse 2s ease-in-out infinite;
          flex-shrink: 0;
        }

        @keyframes dot-pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }

        .sidebar-logout {
          width: 100%;
          padding: 12px;
          border-radius: 14px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1),
                      background 0.25s ease, border-color 0.25s ease;

          /* Glass logout button */
          background: rgba(255, 69, 58, 0.08);
          border: 1px solid rgba(255, 69, 58, 0.22);
          color: rgba(255, 69, 58, 0.9);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }

        .sidebar-logout:hover {
          background: rgba(255, 69, 58, 0.15);
          border-color: rgba(255, 69, 58, 0.4);
          transform: translateY(-1px);
        }

        .sidebar-logout:active {
          transform: scale(0.98);
        }

        @media (prefers-reduced-motion: reduce) {
          .sidebar-dot { animation: none; }
          .sidebar-logout:hover { transform: none; }
        }
      `}</style>
    </>
  );
}
"use client";

import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import supabase from "../../lib/supabase";

const LOW_ACTIVITY_THRESHOLD = 20;
const LOW_ACTIVITY_MESSAGE = "Low GitHub activity detected.";
const DEFAULT_MESSAGE =
  "Reality Check: Repository activity is below expected productivity levels.";

interface GitHubRepo {
  id: number;
  name: string;
}

export default function NotificationCard() {
  const [notifications, setNotifications] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const bellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadNotifications(session: any) {
      const alerts: string[] = [];

      if (!session) {
        if (isMounted) setNotifications([]);
        return;
      }

      const isGitHubUser = session.user.app_metadata.provider === "github";

      if (isGitHubUser && session.provider_token) {
        try {
          const response = await fetch("https://api.github.com/user/repos", {
            headers: {
              Authorization: `Bearer ${session.provider_token}`,
            },
          });

          if (response.ok) {
            const repos: GitHubRepo[] = await response.json();
            const repoCount = Array.isArray(repos) ? repos.length : 0;

            if (repoCount < LOW_ACTIVITY_THRESHOLD) {
              alerts.push(LOW_ACTIVITY_MESSAGE);
            }
          }
        } catch (error) {
          console.error("Failed to fetch GitHub repos:", error);
        }
      }

      if (alerts.length === 0) {
        alerts.push(DEFAULT_MESSAGE);
      }

      if (isMounted) {
        setNotifications(alerts);
      }
    }

    // Check once immediately (covers the case where session is already ready)
    supabase.auth.getSession().then(({ data: { session } }) => {
      loadNotifications(session);
    });

    // Also react to any auth state change (covers rehydration after refresh)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        loadNotifications(session);
      }
    );

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Close panel when clicking outside it.
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const clickedBell = bellRef.current?.contains(event.target as Node);
      const clickedPanel = panelRef.current?.contains(event.target as Node);

      if (!clickedBell && !clickedPanel) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const count = notifications.length;

  return (
    <>
      <div ref={bellRef} className="fixed top-24 right-6 z-50">
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label="Notifications"
          className="relative flex items-center justify-center w-12 h-12 rounded-full bg-slate-900 border border-slate-800 hover:border-slate-600 transition-colors shadow-lg"
        >
          <span className="text-xl">🔔</span>

          {count > 0 && (
            <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-xs font-bold notif-badge-pulse">
              {count}
            </span>
          )}
        </button>
      </div>

      {mounted &&
        isOpen &&
        createPortal(
          <div
            ref={panelRef}
            style={{
              position: "fixed",
              top: "104px",
              right: "24px",
              zIndex: 99999,
            }}
            className="w-80 max-h-96 overflow-y-auto rounded-lg border border-slate-800 bg-slate-900 shadow-2xl notif-panel-enter"
          >
            <div className="p-4 border-b border-slate-800">
              <h2 className="text-lg font-bold">🔔 Notifications</h2>
            </div>

            <div className="p-3 space-y-3">
              {notifications.map((item, index) => (
                <div
                  key={index}
                  className="border border-slate-800 rounded-lg p-3 bg-slate-950 text-sm text-slate-200"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>,
          document.body
        )}

      <style jsx global>{`
        .notif-badge-pulse {
          animation: notif-pulse 1.8s ease-in-out infinite;
        }

        @keyframes notif-pulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.15);
          }
        }

        .notif-panel-enter {
          animation: notif-panel-fade-in 0.18s ease-out;
          transform-origin: top right;
        }

        @keyframes notif-panel-fade-in {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-4px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </>
  );
}
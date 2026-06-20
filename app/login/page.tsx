"use client";

import { useEffect, useState } from "react";
import supabase from "../../lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function checkUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);
      setLoading(false);
    }

    checkUser();
  }, []);

  async function signInWithGithub() {
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: window.location.origin,
      },
    });
  }

  async function signInWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
        scopes:
          "openid email profile https://www.googleapis.com/auth/calendar.readonly",
      },
    });
  }

  async function logout() {
    await supabase.auth.signOut();
    location.reload();
  }

  if (loading) {
    return (
      <main className="login-main">
        <div className="login-loading">
          <div className="login-spinner" />
          <p>Checking session...</p>
        </div>

        <style jsx global>{`
          .login-main {
            min-height: 100vh;
            background: var(--bg);
            color: var(--text-primary);
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .login-loading {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 16px;
            color: var(--text-secondary);
          }

          .login-spinner {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            border: 2px solid var(--hairline);
            border-top-color: var(--accent);
            animation: login-spin 0.8s linear infinite;
          }

          @keyframes login-spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </main>
    );
  }

  return (
    <main className="login-main">
      {/* Giant background wordmark, color-cycling */}
      <div className="login-bg-text-wrap">
        <span className="login-bg-text">TRACKD AI</span>
      </div>

      {/* Soft dark overlay so the card stays readable on top */}
      <div className="login-overlay" />

      <div className="login-card">
        <h1 className="text-4xl font-bold mb-2 logo-gradient-text login-title">
          TrackD AI
        </h1>

        {user ? (
          <>
            <p className="login-status login-fade-in" style={{ animationDelay: "0.15s" }}>
              Logged in as
            </p>

            <p className="login-email login-fade-in" style={{ animationDelay: "0.22s" }}>
              {user.email}
            </p>

            <button
              onClick={() => router.push("/")}
              className="login-btn login-btn-primary login-fade-in"
              style={{ animationDelay: "0.3s" }}
            >
              Go To Dashboard
            </button>

            <button
              onClick={logout}
              className="login-btn login-btn-danger login-fade-in"
              style={{ animationDelay: "0.38s" }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <p className="login-subtitle login-fade-in" style={{ animationDelay: "0.1s" }}>
              Sign in to access your productivity dashboard.
            </p>

            <button
              onClick={signInWithGithub}
              className="login-btn login-btn-github login-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.9.57.1.78-.25.78-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.75 2.7 1.25 3.36.96.1-.74.4-1.25.72-1.54-2.55-.29-5.23-1.27-5.23-5.67 0-1.25.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.18 1.18.92-.26 1.91-.39 2.89-.39.98 0 1.97.13 2.89.39 2.2-1.49 3.17-1.18 3.17-1.18.63 1.58.24 2.75.12 3.04.74.8 1.18 1.83 1.18 3.08 0 4.41-2.69 5.38-5.25 5.66.42.36.78 1.06.78 2.15 0 1.56-.01 2.81-.01 3.19 0 .31.21.66.79.55C20.21 21.39 23.5 17.07 23.5 12 23.5 5.73 18.27.5 12 .5z" />
              </svg>
              Continue with GitHub
            </button>

            <button
              onClick={signInWithGoogle}
              className="login-btn login-btn-google login-fade-in"
              style={{ animationDelay: "0.3s" }}
            >
              <svg viewBox="0 0 24 24" width="18" height="18">
                <path
                  fill="#fff"
                  d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81z"
                />
              </svg>
              Continue with Google
            </button>
          </>
        )}
      </div>

      <style jsx global>{`
        .login-main {
          position: relative;
          min-height: 100vh;
          background: var(--bg);
          color: var(--text-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        /* Giant background wordmark */
        .login-bg-text-wrap {
          position: fixed;
          inset: 0;
          z-index: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          pointer-events: none;
        }

        .login-bg-text {
          font-size: clamp(80px, 18vw, 260px);
          font-weight: 800;
          letter-spacing: -0.02em;
          white-space: nowrap;
          line-height: 1;
          color: #ffffff;
          opacity: 0.9;
          animation:
            login-bg-color-cycle 10s ease-in-out infinite,
            login-bg-pulse 6s ease-in-out infinite;
        }

        @keyframes login-bg-color-cycle {
          0% {
            color: #ffffff;
          }
          20% {
            color: #0071e3;
          }
          40% {
            color: #5ac8fa;
          }
          60% {
            color: #30d158;
          }
          80% {
            color: #ff9f0a;
          }
          100% {
            color: #ffffff;
          }
        }

        @keyframes login-bg-pulse {
          0%,
          100% {
            opacity: 0.85;
            transform: scale(1);
          }
          50% {
            opacity: 0.55;
            transform: scale(1.03);
          }
        }

        /* Dark scrim so the card on top stays readable */
        .login-overlay {
          position: fixed;
          inset: 0;
          z-index: 0;
          background: radial-gradient(
            circle at center,
            rgba(10, 10, 12, 0.35) 0%,
            rgba(10, 10, 12, 0.75) 65%,
            rgba(10, 10, 12, 0.92) 100%
          );
          pointer-events: none;
        }

        .login-card {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 420px;
          padding: 40px;
          border-radius: 20px;

          background: var(--surface);
          backdrop-filter: blur(24px) saturate(140%);
          -webkit-backdrop-filter: blur(24px) saturate(140%);
          border: 1px solid var(--hairline);

          box-shadow:
            0 1px 0 0 rgba(255, 255, 255, 0.04) inset,
            0 20px 50px -20px rgba(0, 0, 0, 0.7);

          animation: login-card-rise 0.6s cubic-bezier(0.16, 1, 0.3, 1) backwards;
        }

        @keyframes login-card-rise {
          from {
            opacity: 0;
            transform: translateY(16px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .login-title {
          animation: login-card-rise 0.5s cubic-bezier(0.16, 1, 0.3, 1) backwards;
          animation-delay: 0.05s;
        }

        .login-fade-in {
          opacity: 0;
          animation: login-fade-up 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes login-fade-up {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .login-subtitle {
          color: var(--text-secondary);
          margin-bottom: 32px;
        }

        .login-status {
          color: #30d158;
          font-size: 14px;
          margin-bottom: 4px;
        }

        .login-email {
          color: var(--text-primary);
          margin-bottom: 24px;
          font-weight: 500;
        }

        .login-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;

          padding: 14px;
          margin-top: 12px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 15px;
          border: 1px solid transparent;
          cursor: pointer;

          transition:
            transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1),
            box-shadow 0.25s ease,
            background 0.25s ease;
        }

        .login-btn:first-of-type {
          margin-top: 0;
        }

        .login-btn:hover {
          transform: translateY(-2px);
        }

        .login-btn:active {
          transform: translateY(0) scale(0.98);
        }

        .login-btn-github {
          background: var(--text-primary);
          color: #0a0a0c;
        }

        .login-btn-github:hover {
          box-shadow: 0 12px 24px -8px rgba(255, 255, 255, 0.15);
        }

        .login-btn-google {
          background: rgba(255, 255, 255, 0.06);
          color: var(--text-primary);
          border-color: var(--hairline);
        }

        .login-btn-google:hover {
          background: rgba(255, 255, 255, 0.1);
          box-shadow: 0 12px 24px -8px rgba(0, 113, 227, 0.2);
        }

        .login-btn-primary {
          background: var(--accent);
          color: white;
        }

        .login-btn-primary:hover {
          box-shadow: 0 12px 24px -8px rgba(0, 113, 227, 0.4);
        }

        .login-btn-danger {
          background: var(--danger-soft);
          color: var(--danger);
          border-color: rgba(255, 69, 58, 0.3);
        }

        .login-btn-danger:hover {
          background: rgba(255, 69, 58, 0.18);
        }

        @media (prefers-reduced-motion: reduce) {
          .login-bg-text,
          .login-card,
          .login-title,
          .login-fade-in,
          .login-spinner {
            animation: none !important;
          }
          .login-bg-text {
            color: #ffffff;
            opacity: 0.6;
          }
          .login-fade-in {
            opacity: 1;
          }
          .login-btn:hover,
          .login-btn:active {
            transform: none;
          }
        }
      `}</style>
    </main>
  );
}
"use client";

import { useEffect, useState } from "react";
import supabase from "../../lib/supabase";

export default function LiveProductivityStats() {

  const [score, setScore] = useState(0);
  const [grade, setGrade] = useState("F");
  const [trend, setTrend] = useState("⇊ Critical");

  useEffect(() => {

    async function calculate() {

      let repoCount = 0;
      let eventCount = 0;

      const {
        data: { session }
      } = await supabase.auth.getSession();

      if (!session) return;

      try {

        if (
          session.provider_token &&
          session.user.app_metadata.provider === "github"
        ) {

          const repoRes = await fetch(
            "https://api.github.com/user/repos",
            {
              headers: {
                Authorization:
                  `Bearer ${session.provider_token}`
              }
            }
          );

          const repos = await repoRes.json();

          repoCount = Array.isArray(repos)
            ? repos.length
            : 0;
        }

      } catch {}

      const calculatedScore =
        Math.max(
          0,
          Math.min(
            100,
            repoCount * 2
          )
        );

      let calculatedGrade = "F";

      if (calculatedScore >= 90)
        calculatedGrade = "S";
      else if (calculatedScore >= 80)
        calculatedGrade = "A";
      else if (calculatedScore >= 70)
        calculatedGrade = "B";
      else if (calculatedScore >= 60)
        calculatedGrade = "C";
      else if (calculatedScore >= 40)
        calculatedGrade = "D";

      let calculatedTrend = "⇊ Critical";

      if (calculatedScore >= 90)
        calculatedTrend = "↗ Elite";
      else if (calculatedScore >= 80)
        calculatedTrend = "↗ Strong";
      else if (calculatedScore >= 60)
        calculatedTrend = "→ Average";
      else if (calculatedScore >= 40)
        calculatedTrend = "↘ Weak";

      setScore(calculatedScore);
      setGrade(calculatedGrade);
      setTrend(calculatedTrend);

    }

    calculate();

  }, []);

  return (
    <>
      <div className="card">
        <p className="metric-title">
          Productivity Score
        </p>

        <h2 className="metric-value">
          {score}
        </h2>
      </div>

      <div className="card">
        <p className="metric-title">
          Performance Grade
        </p>

        <h2 className="metric-value">
          {grade}
        </h2>
      </div>

      <div className="card">
        <p className="metric-title">
          Trend Direction
        </p>

        <h2 className="text-3xl font-bold mt-4">
          {trend}
        </h2>
      </div>
    </>
  );
}
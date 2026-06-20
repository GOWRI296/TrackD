import supabase from "../../lib/supabase";
import ProductivityHeatmap from "../components/ProductivityHeatmap";

export default async function WeeklyReviewPage() {

  const { data } = await supabase
    .from("daily_metrics")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(7);

  const rows = data || [];

  const avgProductivity =
    rows.length > 0
      ? Math.round(
          rows.reduce(
            (sum, item) =>
              sum + (item.productivity_score || 0),
            0
          ) / rows.length
        )
      : 0;

  const bestScore =
    rows.length > 0
      ? Math.max(
          ...rows.map(
            item => item.productivity_score || 0
          )
        )
      : 0;

  const worstScore =
    rows.length > 0
      ? Math.min(
          ...rows.map(
            item => item.productivity_score || 0
          )
        )
      : 0;

  const avgMeetings =
    rows.length > 0
      ? Math.round(
          rows.reduce(
            (sum, item) =>
              sum + (item.meeting_hours || 0),
            0
          ) / rows.length
        )
      : 0;

  let grade = "F";

  if (avgProductivity >= 90) {
    grade = "A";
  }
  else if (avgProductivity >= 75) {
    grade = "B";
  }
  else if (avgProductivity >= 60) {
    grade = "C";
  }

  let verdict = "";

  if (avgProductivity >= 90) {

    verdict =
`Reality Check

Your numbers suggest strong execution. Unlike many teams that confuse activity with progress, measurable output is actually being produced.

Risk

Success often creates complacency. Maintain standards or the decline will be gradual and invisible.

Executive Verdict

A-grade performance. Keep delivering.`;

  }
  else if (avgProductivity >= 75) {

    verdict =
`Reality Check

The week was acceptable, not impressive. Output exists, but nothing here suggests exceptional performance.

Risk

You are operating in the comfort zone. Consistency without acceleration eventually becomes stagnation.

Executive Verdict

Average performers survive. Top performers separate themselves. You're currently in the middle.`;

  }
  else if (avgProductivity >= 60) {

    verdict =
`Reality Check

The workload appears high, but the results do not justify the time invested. Activity is visible. Impact is not.

Risk

You may be mistaking busyness for productivity.

Executive Verdict

Current performance would struggle to stand out in a competitive environment.`;

  }
  else {

    verdict =
`Reality Check

The numbers are concerning. Execution is significantly below expectations and there is little evidence of meaningful output.

Risk

At this level, effort is being consumed without creating measurable value.

Executive Verdict

If this trend continues, performance becomes a liability rather than an asset. Immediate changes are required.`;

  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-10 ml-64">

      {/* Header */}

      <div className="mb-10">

        <h1 className="text-5xl font-bold">
          Weekly Review
        </h1>

        <p className="text-slate-400 mt-3">
          Executive performance audit based on the last 7 records.
        </p>

      </div>

      {/* KPI Cards */}

      <div className="grid lg:grid-cols-5 md:grid-cols-2 gap-6">

        <div className="card">

          <p className="metric-title">
            Weekly Grade
          </p>

          <h2 className="text-6xl font-bold text-red-400 mt-4">
            {grade}
          </h2>

        </div>

        <div className="card">

          <p className="metric-title">
            Avg Productivity
          </p>

          <h2 className="metric-value">
            {avgProductivity}
          </h2>

        </div>

        <div className="card">

          <p className="metric-title">
            Best Score
          </p>

          <h2 className="metric-value">
            {bestScore}
          </h2>

        </div>

        <div className="card">

          <p className="metric-title">
            Worst Score
          </p>

          <h2 className="metric-value">
            {worstScore}
          </h2>

        </div>

        <div className="card">

          <p className="metric-title">
            Avg Meeting Hours
          </p>

          <h2 className="metric-value">
            {avgMeetings}
          </h2>

        </div>

      </div>

            {/* Executive Audit */}

      <div className="card mt-8">

        <h2 className="text-3xl font-bold mb-6">
          Executive Performance Audit
        </h2>

        <div className="border border-red-900/50 bg-red-950/20 rounded-xl p-6">

          <p className="text-lg leading-8 whitespace-pre-line text-slate-200">
            {verdict}
          </p>

        </div>

      </div>

      {/* Productivity Heatmap */}

      <ProductivityHeatmap
        data={rows}
      />

    </main>
  );
}
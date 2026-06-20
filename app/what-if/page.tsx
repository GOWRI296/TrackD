import WhatIfCalculator from "../components/WhatIfCalculator";

export default function WhatIfPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white p-10 ml-64">

      <h1 className="text-5xl font-bold">
        What-If Analysis
      </h1>

      <p className="text-slate-400 mt-3">
        Simulate future productivity before committing to your schedule.
      </p>

      <WhatIfCalculator />

    </main>
  );
}
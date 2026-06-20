"use client";

import { useState } from "react";

export default function WhatIfCalculator() {
  const [events, setEvents] = useState(0);
  const [meetings, setMeetings] = useState(0);

  const score = Math.max(
    100 -
    (events * 5) -
    (meetings * 10),
    0
  );

  const focusHours = Math.max(
    40 - meetings,
    0
  );

  let grade = "F";

  if (score >= 85) {
    grade = "A";
  }
  else if (score >= 70) {
    grade = "B";
  }
  else if (score >= 55) {
    grade = "C";
  }
  else if (score >= 40) {
    grade = "D";
  }

  let verdict = "";

  if (score >= 90) {

    verdict =
`Reality Check

Your schedule leaves enough room for execution. Most of your time remains available for meaningful work.

Risk

Success often creates complacency. Protect your focus time.

Executive Verdict

You are optimizing for output, not activity.`;

  }
  else if (score >= 75) {

    verdict =
`Reality Check

Your calendar is beginning to compete with actual work. Productivity is still possible, but your margin for error is shrinking.

Risk

Every additional meeting now directly reduces execution capacity.

Executive Verdict

Good performance, but not exceptional.`;

  }
  else if (score >= 60) {

    verdict =
`Reality Check

The workload is starting to control your day. Too much coordination is replacing execution.

Risk

You are spending more time discussing work than completing it.

Executive Verdict

Average performers stay here. Top performers don't.`;

  }
  else if (score >= 40) {

    verdict =
`Reality Check

The calendar is overloaded. Time is being spent managing work instead of producing results.

Risk

You may be confusing activity with achievement.

Executive Verdict

Busy does not equal productive.`;

  }
  else {

    verdict =
`Reality Check

This schedule is a productivity disaster. Most of your available focus time has already been sacrificed.

Risk

The probability of meaningful output is extremely low.

Executive Verdict

If this were your actual weekly schedule, performance would likely fall below competitive expectations. Major reductions in meetings and commitments are required.`;

  }

  return (
    <div className="card mt-8">

      <h2 className="text-3xl font-bold mb-6">
        Productivity Simulator
      </h2>

      <div className="grid md:grid-cols-2 gap-6">

        <div>
          <label className="block mb-2">
            Upcoming Events
          </label>

          <input
            type="number"
            min="0"
            value={events}
            onChange={(e) =>
              setEvents(Number(e.target.value))
            }
            className="w-full p-3 rounded bg-slate-900 border border-slate-700"
          />
        </div>

        <div>
          <label className="block mb-2">
            Meeting Hours
          </label>

          <input
            type="number"
            min="0"
            value={meetings}
            onChange={(e) =>
              setMeetings(Number(e.target.value))
            }
            className="w-full p-3 rounded bg-slate-900 border border-slate-700"
          />
        </div>

      </div>

      <div className="grid md:grid-cols-4 gap-6 mt-8">

        <div className="card">
          <p className="metric-title">
            Predicted Score
          </p>

          <h2 className="metric-value">
            {score}
          </h2>
        </div>

        <div className="card">
          <p className="metric-title">
            Predicted Grade
          </p>

          <h2 className="metric-value">
            {grade}
          </h2>
        </div>

        <div className="card">
          <p className="metric-title">
            Focus Hours Left
          </p>

          <h2 className="metric-value">
            {focusHours}h
          </h2>
        </div>

        <div className="card">
          <p className="metric-title">
            Outlook
          </p>

          <h2 className="metric-value">
            {score >= 75 ? "Strong" : score >= 40 ? "Weak" : "Critical"}
          </h2>
        </div>

      </div>

      <div className="mt-8 border border-red-900/50 bg-red-950/20 rounded-xl p-6">

        <h3 className="text-2xl font-bold mb-4">
          Executive Assessment
        </h3>

        <p className="text-lg leading-8 whitespace-pre-line">
          {verdict}
        </p>

      </div>

    </div>
  );
}
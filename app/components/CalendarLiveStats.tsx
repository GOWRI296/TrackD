"use client";

import { useEffect, useState } from "react";
import supabase from "../../lib/supabase";

export default function CalendarLiveStats() {

  const [eventCount, setEventCount] = useState(0);

  useEffect(() => {

    async function loadEvents() {

      const {
        data: { session }
      } = await supabase.auth.getSession();

      if (!session?.provider_token) {
        console.log("No Google token");
        return;
      }

      const response = await fetch(
        "https://www.googleapis.com/calendar/v3/calendars/primary/events",
        {
          headers: {
            Authorization:
              `Bearer ${session.provider_token}`
          }
        }
      );

      const data = await response.json();

      setEventCount(
        data.items?.length || 0
      );

    }

    loadEvents();

  }, []);

  return (
    <div className="card">

      <h2 className="metric-title">
        Upcoming Events
      </h2>

      <p className="metric-value">
        {eventCount}
      </p>

    </div>
  );
}
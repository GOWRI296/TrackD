"use client";

import { useEffect, useState } from "react";
import supabase from "../../lib/supabase";

export default function CalendarTest() {

  const [events, setEvents] = useState<any[]>([]);

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
        "https://www.googleapis.com/calendar/v3/calendars/primary/events?maxResults=10&orderBy=startTime&singleEvents=true",
        {
          headers: {
            Authorization:
              `Bearer ${session.provider_token}`
          }
        }
      );

      const data = await response.json();

      console.log("STATUS:", response.status);
      console.log("DATA:", data);

      setEvents(data.items || []);

    }

    loadEvents();

  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-white p-10">

      <h1 className="text-4xl font-bold mb-8">
        My Calendar Events
      </h1>

      {events.map((event: any) => (
        <div
          key={event.id}
          className="border border-slate-800 p-4 rounded-xl mb-4"
        >
          <h2 className="font-bold">
            {event.summary || "Untitled Event"}
          </h2>

          <p className="text-slate-400">
            {event.start?.dateTime ||
             event.start?.date}
          </p>
        </div>
      ))}

    </main>
  );
}
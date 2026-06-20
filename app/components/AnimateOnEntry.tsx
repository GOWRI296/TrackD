// app/components/AnimateOnEntry.tsx
"use client";

import { useEffect, useState } from "react";

export default function AnimateOnEntry({ children }: { children: React.ReactNode }) {
  const [entryKey, setEntryKey] = useState(0);

  useEffect(() => {
    // Bump the key once per real navigation/mount (covers login redirect
    // and returning to the tab/route), so CSS animations replay.
    setEntryKey((k) => k + 1);
  }, []);

  return <div key={entryKey}>{children}</div>;
}
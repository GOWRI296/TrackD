"use client";

import { useEffect } from "react";
import supabase from "../../lib/supabase";

export default function TestPage() {

  useEffect(() => {

    async function check() {

      const session =
        await supabase.auth.getSession();

      console.log("SESSION:", session);

      const user =
        await supabase.auth.getUser();

      console.log("USER:", user);

    }

    check();

  }, []);

  return (
    <div className="p-10">
      Testing Auth...
    </div>
  );
}
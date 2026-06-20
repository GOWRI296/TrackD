"use client";

import { useEffect } from "react";
import supabase from "../../lib/supabase";

export default function AuthTest() {

  useEffect(() => {

    async function run() {

      const session =
        await supabase.auth.getSession();

      console.log("SESSION:", session);

      const user =
        await supabase.auth.getUser();

      console.log("USER:", user);

    }

    run();

  }, []);

  return (
    <div className="p-10 text-white">
      Auth Test
    </div>
  );
}
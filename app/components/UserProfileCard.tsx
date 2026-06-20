"use client";

import { useEffect, useState } from "react";
import supabase from "../../lib/supabase";

export default function UserProfileCard() {

  const [user, setUser] = useState<any>(null);

  useEffect(() => {

    async function loadUser() {

      const {
        data: { user }
      } = await supabase.auth.getUser();

      setUser(user);

    }

    loadUser();

  }, []);

  if (!user) return null;

  return (
  <div className="flex items-center gap-3">

    <div className="text-right">

      <p className="font-semibold text-sm">
        {user.user_metadata?.full_name}
      </p>

      <p className="text-xs text-slate-400">
        Connected
      </p>

    </div>

    <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center font-bold text-black">
      {user.user_metadata?.full_name?.[0] || "U"}
    </div>

  </div>
);
}
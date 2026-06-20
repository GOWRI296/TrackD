"use client";

import { useEffect } from "react";
import supabase from "../../lib/supabase";

export default function AuthListener() {

  useEffect(() => {

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (event, session) => {

        console.log("AUTH EVENT:", event);

        if (session?.user) {
          console.log(
            "SIGNED IN AS:",
            session.user.email
          );
        }

      }
    );

    return () => {
      subscription.unsubscribe();
    };

  }, []);

  return null;
}
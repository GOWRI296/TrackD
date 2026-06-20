"use client";

import { useEffect, useState } from "react";
import supabase from "../../lib/supabase";

export default function GithubTestPage() {

  const [repos, setRepos] = useState<any[]>([]);

  useEffect(() => {

    async function loadRepos() {

      const {
        data: { session }
      } = await supabase.auth.getSession();

      if (!session?.provider_token) {
        console.log("No GitHub token");
        return;
      }

      const response = await fetch(
        "https://api.github.com/user/repos",
        {
          headers: {
            Authorization:
              `Bearer ${session.provider_token}`
          }
        }
      );

      const data = await response.json();

      console.log(data);

      setRepos(data);

    }

    loadRepos();

  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-white p-10">

      <h1 className="text-4xl font-bold mb-8">
        My GitHub Repositories
      </h1>

      {repos.map((repo: any) => (
        <div
          key={repo.id}
          className="border border-slate-800 p-4 rounded-xl mb-4"
        >
          <h2 className="font-bold">
            {repo.name}
          </h2>

          <p className="text-slate-400">
            {repo.language}
          </p>
        </div>
      ))}

    </main>
  );
}
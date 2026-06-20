"use client";

import { useEffect, useState } from "react";
import supabase from "../../lib/supabase";

export default function GithubLiveStats() {

  const [repoCount, setRepoCount] = useState(0);

  useEffect(() => {

    async function loadRepos() {

  const {
  data: { session }
} = await supabase.auth.getSession();

console.log(
  "Provider:",
  session?.user?.app_metadata?.provider
);

console.log(
  "Provider Token:",
  session?.provider_token
);

if (!session?.provider_token) {
  setRepoCount(0);
  return;
}

  const response = await fetch(
    "https://api.github.com/user/repos",
    {
      headers: {
        Authorization: `Bearer ${session.provider_token}`
      }
    }
  );

 console.log("Status:", response.status);

const repos = await response.json();

console.log("Repos:", repos);

setRepoCount(Array.isArray(repos) ? repos.length : 0);

}

    loadRepos();

  }, []);

  return (
    <div className="card">

      <h2 className="metric-title">
        Total Repositories
      </h2>

      <p className="metric-value">
        {repoCount}
      </p>

    </div>
  );
}
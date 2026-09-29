"use client";

import { useState } from "react";

export default function RandomPanel() {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  async function fetchRandom() {
    setLoading(true);
    try {
      const res = await fetch("/api/random");
      setResult(JSON.stringify(await res.json(), null, 2));
    } catch (err) {
      setResult(err instanceof Error ? err.message : "Request failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex w-full max-w-2xl flex-col gap-6">
      <button
        onClick={fetchRandom}
        disabled={loading}
        className="self-start rounded-full bg-black px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
      >
        {loading ? "Loading…" : "Get random data"}
      </button>
      {result && (
        <pre className="overflow-x-auto rounded-lg border border-zinc-200 bg-zinc-50 p-4 font-mono text-sm text-black dark:border-zinc-800 dark:bg-zinc-900 dark:text-white">
          {result}
        </pre>
      )}
    </div>
  );
}

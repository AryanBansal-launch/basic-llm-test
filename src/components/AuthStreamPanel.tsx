"use client";

import { useState } from "react";

type Row = { n: number; of: number; user: string; serverTime: string; receivedAt: number };

export default function AuthStreamPanel() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function start() {
    setLoading(true);
    setError("");
    setRows([]);

    try {
      const t0 = performance.now();
      const res = await fetch("/api/auth-stream");
      if (res.status === 401) throw new Error("401 Unauthorized: no or wrong credentials.");
      if (!res.ok || !res.body) throw new Error(`Request failed (${res.status})`);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true }).replace(/\r\n/g, "\n");
        const events = buffer.split("\n\n");
        buffer = events.pop() ?? "";
        for (const event of events) {
          const line = event.split("\n").find((l) => l.startsWith("data:"));
          if (!line) continue;
          const row = { ...JSON.parse(line.slice(5)), receivedAt: performance.now() - t0 };
          setRows((prev) => [...prev, row]);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex w-full max-w-2xl flex-col gap-6">
      <button
        onClick={start}
        disabled={loading}
        className="self-start rounded-full bg-black px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
      >
        {loading ? "Streaming…" : "Start protected stream"}
      </button>

      {error && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
          {error}
        </p>
      )}

      {rows.length > 0 && (
        <table className="w-full overflow-hidden rounded-lg border border-zinc-200 text-left font-mono text-sm dark:border-zinc-800">
          <thead className="bg-zinc-100 text-xs text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
            <tr>
              <th className="px-3 py-2">Event</th>
              <th className="px-3 py-2">Received at</th>
              <th className="px-3 py-2">Signed in as</th>
            </tr>
          </thead>
          <tbody className="text-black dark:text-white">
            {rows.map((r) => (
              <tr key={r.n} className="border-t border-zinc-200 dark:border-zinc-800">
                <td className="px-3 py-1.5">
                  {r.n} / {r.of}
                </td>
                <td className="px-3 py-1.5">{(r.receivedAt / 1000).toFixed(2)}s</td>
                <td className="px-3 py-1.5">{r.user}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

"use client";

import { FormEvent, useState } from "react";

type Mode = "buffered" | "llm" | "plain";

export default function QAPanel({ mode }: { mode: Mode }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!question.trim() || loading) return;

    setLoading(true);
    setError("");
    setAnswer("");

    try {
      if (mode === "buffered") {
        const res = await fetch("/api/buffered", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Request failed");
        setAnswer(data.answer);
      } else {
        const res = await fetch(`/api/${mode}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question }),
        });
        if (!res.ok || !res.body) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "Request failed");
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let acc = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          if (mode === "plain") {
            acc += decoder.decode(value, { stream: true });
            setAnswer(acc);
            continue;
          }

          // Content-Type is text/event-stream, but EventSource can't send
          // a POST body, so we read + parse the SSE frames ourselves.
          // Gemini frames events with CRLF; normalize so "\n\n" splits work.
          buffer += decoder.decode(value, { stream: true });
          buffer = buffer.replace(/\r\n/g, "\n");

          const events = buffer.split("\n\n");
          buffer = events.pop() ?? "";

          for (const event of events) {
            for (const line of event.split("\n")) {
              if (!line.startsWith("data:")) continue;
              const payload = line.slice("data:".length).trim();
              if (!payload || payload === "[DONE]") continue;

              const parsed = JSON.parse(payload);
              const text: string =
                parsed?.candidates?.[0]?.content?.parts
                  ?.map((p: { text?: string }) => p.text ?? "")
                  .join("") ?? "";
              if (text) {
                acc += text;
                setAnswer(acc);
              }
            }
          }
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
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question..."
          rows={3}
          className="w-full resize-none rounded-lg border border-zinc-300 bg-white p-3 text-sm text-black outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
        />
        <button
          type="submit"
          disabled={loading || !question.trim()}
          className="self-start rounded-full bg-black px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
        >
          {loading
            ? mode === "buffered"
              ? "Waiting for full response…"
              : "Streaming…"
            : "Ask"}
        </button>
      </form>

      {error && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
          {error}
        </p>
      )}

      {(answer || (loading && mode !== "buffered")) && (
        <div className="whitespace-pre-wrap rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-sm leading-relaxed text-black dark:border-zinc-800 dark:bg-zinc-900 dark:text-white">
          {answer}
          {loading && mode !== "buffered" && (
            <span className="ml-0.5 inline-block h-4 w-2 animate-pulse bg-current align-text-bottom" />
          )}
        </div>
      )}
    </div>
  );
}

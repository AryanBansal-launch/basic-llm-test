import QAPanel from "@/components/QAPanel";
import RouteInfo from "@/components/RouteInfo";

export default function PlainPage() {
  return (
    <div className="flex flex-1 flex-col items-center gap-8 bg-zinc-50 px-6 py-16 dark:bg-black">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-semibold text-black dark:text-white">
          Streaming (text/plain)
        </h1>
        <p className="max-w-md text-sm text-zinc-600 dark:text-zinc-400">
          The same stream as /llm, sent as plain text instead.
        </p>
      </div>
      <RouteInfo
        sections={[
          {
            title: "How it works",
            items: [
              "The server calls Gemini's streaming endpoint, strips the event framing, and sends only the answer text.",
              "The response is chunked text/plain; the browser appends each chunk as it arrives.",
            ],
          },
          {
            title: "What you should see",
            items: [
              "The same word-by-word bursts as /llm.",
              "DevTools has no EventStream tab here; the Response tab shows the raw text.",
              "If /llm streams on Launch but this page shows the answer all at once, Launch is buffering based on content type.",
            ],
          },
        ]}
      />
      <QAPanel mode="plain" />
    </div>
  );
}

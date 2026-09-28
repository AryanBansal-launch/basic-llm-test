import QAPanel from "@/components/QAPanel";
import RouteInfo from "@/components/RouteInfo";

export default function BufferedPage() {
  return (
    <div className="flex flex-1 flex-col items-center gap-8 bg-zinc-50 px-6 py-16 dark:bg-black">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-semibold text-black dark:text-white">
          Buffered response
        </h1>
        <p className="max-w-md text-sm text-zinc-600 dark:text-zinc-400">
          The baseline: no streaming at all.
        </p>
      </div>
      <RouteInfo
        sections={[
          {
            title: "How it works",
            items: [
              "The server calls Gemini's regular (non-streaming) endpoint.",
              "It waits for the complete answer, then returns it as one JSON response (application/json).",
            ],
          },
          {
            title: "What you should see",
            items: [
              "The button says “Waiting for full response…” and nothing appears for a few seconds.",
              "Then the whole answer shows up at once.",
              "This should behave the same locally and on Launch.",
            ],
          },
        ]}
      />
      <QAPanel mode="buffered" />
    </div>
  );
}

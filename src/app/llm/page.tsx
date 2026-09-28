import QAPanel from "@/components/QAPanel";
import RouteInfo from "@/components/RouteInfo";

export default function LlmPage() {
  return (
    <div className="flex flex-1 flex-col items-center gap-8 bg-zinc-50 px-6 py-16 dark:bg-black">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-semibold text-black dark:text-white">
          Streaming (text/event-stream)
        </h1>
        <p className="max-w-md text-sm text-zinc-600 dark:text-zinc-400">
          Server-Sent Events, the format most LLM APIs use.
        </p>
      </div>
      <RouteInfo
        sections={[
          {
            title: "How it works",
            items: [
              "The server calls Gemini's streaming endpoint and forwards its Server-Sent Events untouched.",
              "The response is sent as text/event-stream; the browser reads each data: event and pulls out the text.",
            ],
          },
          {
            title: "What you should see",
            items: [
              "Text starts appearing within about a second, in bursts of a few words, with a blinking cursor until it finishes.",
              "In DevTools → Network, the request has an EventStream tab listing each event.",
              "If on Launch the answer appears all at once after a delay, something between the app and the browser is buffering the response.",
            ],
          },
        ]}
      />
      <QAPanel mode="llm" />
    </div>
  );
}

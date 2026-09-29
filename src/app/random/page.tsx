import RandomPanel from "@/components/RandomPanel";
import RouteInfo from "@/components/RouteInfo";

export default function RandomPage() {
  return (
    <div className="flex flex-1 flex-col items-center gap-8 bg-zinc-50 px-6 py-16 dark:bg-black">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-semibold text-black dark:text-white">
          Plain API route
        </h1>
        <p className="max-w-md text-sm text-zinc-600 dark:text-zinc-400">
          The control: an ordinary route with no streaming or buffering code.
        </p>
      </div>
      <RouteInfo
        sections={[
          {
            title: "How it works",
            items: [
              "GET /api/random fetches a random post (1–100) from the free JSONPlaceholder API and returns it as JSON.",
              "No Gemini call and no stream handling; just a normal Next.js route.",
            ],
          },
          {
            title: "What you should see",
            items: [
              "A different post almost instantly on every click.",
              "If the same post keeps coming back on Launch, the response is being cached.",
            ],
          },
        ]}
      />
      <RandomPanel />
    </div>
  );
}

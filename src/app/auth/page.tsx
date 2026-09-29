import AuthStreamPanel from "@/components/AuthStreamPanel";
import RouteInfo from "@/components/RouteInfo";

export default function AuthPage() {
  return (
    <div className="flex flex-1 flex-col items-center gap-8 bg-zinc-50 px-6 py-16 dark:bg-black">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-semibold text-black dark:text-white">
          Basic Auth + streaming
        </h1>
        <p className="max-w-md text-sm text-zinc-600 dark:text-zinc-400">
          Checks that a password-protected streaming endpoint works on Launch.
        </p>
      </div>
      <RouteInfo
        sections={[
          {
            title: "How it works",
            items: [
              "GET /api/auth-stream returns 401 with a WWW-Authenticate: Basic header until valid credentials are sent.",
              "With valid credentials it streams 10 text/event-stream events, one every 0.5s. No Gemini call.",
              "Credentials come from BASIC_AUTH_USER / BASIC_AUTH_PASSWORD (defaults: launch / streaming).",
            ],
          },
          {
            title: "What you should see",
            items: [
              "Clicking the button opens the browser's own sign-in prompt.",
              "After signing in, rows appear about 0.5s apart (0.00s, 0.50s, 1.00s…).",
              "Cancel or wrong credentials: a 401 error shows here.",
              "The browser remembers the credentials; use a private window to see the prompt again.",
              "If all rows arrive at once near 4.5s on Launch, the protected stream is being buffered.",
            ],
          },
        ]}
      />
      <AuthStreamPanel />
    </div>
  );
}

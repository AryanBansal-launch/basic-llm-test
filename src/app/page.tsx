import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-10 bg-zinc-50 px-6 py-32 text-center dark:bg-black">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-black dark:text-white">
          Streaming vs. Buffered
        </h1>
        <p className="max-w-md text-zinc-600 dark:text-zinc-400">
          Ask the same question through Gemini two ways and compare.
        </p>
      </div>
      <div className="flex flex-col gap-4 sm:flex-row">
        <Link
          href="/buffered"
          className="flex h-12 w-52 items-center justify-center rounded-full border border-black/10 px-5 text-sm font-medium text-black transition-colors hover:bg-black/[.04] dark:border-white/15 dark:text-white dark:hover:bg-white/[.06]"
        >
          /buffered
        </Link>
        <Link
          href="/llm"
          className="flex h-12 w-52 items-center justify-center rounded-full bg-black px-5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
        >
          /llm (event-stream)
        </Link>
        <Link
          href="/plain"
          className="flex h-12 w-52 items-center justify-center rounded-full bg-black px-5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
        >
          /plain (text/plain)
        </Link>
      </div>
    </div>
  );
}

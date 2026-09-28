type Section = { title: string; items: string[] };

export default function RouteInfo({ sections }: { sections: Section[] }) {
  return (
    <div className="grid w-full max-w-2xl gap-4 sm:grid-cols-2">
      {sections.map((s) => (
        <div
          key={s.title}
          className="rounded-lg border border-zinc-200 bg-white p-4 text-left dark:border-zinc-800 dark:bg-zinc-950"
        >
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            {s.title}
          </h2>
          <ul className="list-disc space-y-1.5 pl-4 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
            {s.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

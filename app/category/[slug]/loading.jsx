export default function CategoryLoading() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8" role="status" aria-live="polite">
      <div className="h-1 w-full overflow-hidden rounded-full bg-linen">
        <div className="h-full w-1/3 animate-pulse rounded-full bg-plum" />
      </div>
      <div className="mt-8 border-b border-ink/10 pb-8">
        <div className="h-4 w-28 rounded-full bg-linen" />
        <div className="mt-5 h-12 w-full max-w-lg rounded-lg bg-linen" />
        <div className="mt-4 h-4 w-full max-w-xl rounded-full bg-linen" />
      </div>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="rounded-lg border border-ink/10 bg-white/70 p-4">
            <div className="aspect-[3/4] rounded-md bg-linen" />
            <div className="mt-4 h-5 rounded-full bg-linen" />
            <div className="mt-2 h-4 w-2/3 rounded-full bg-linen" />
          </div>
        ))}
      </div>
      <span className="sr-only">Loading category</span>
    </section>
  );
}

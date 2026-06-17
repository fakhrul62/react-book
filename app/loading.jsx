export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8" role="status" aria-live="polite">
      <div className="h-1 w-full overflow-hidden rounded-full bg-linen">
        <div className="h-full w-1/3 animate-pulse rounded-full bg-plum" />
      </div>
      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_24rem]">
        <div className="space-y-4">
          <div className="h-4 w-44 rounded-full bg-linen" />
          <div className="h-12 w-full max-w-xl rounded-lg bg-linen" />
          <div className="h-12 w-3/4 rounded-lg bg-linen" />
          <div className="h-5 w-full max-w-lg rounded-full bg-linen" />
        </div>
        <div className="aspect-[3/4] rounded-lg bg-linen shadow-book" />
      </div>
      <span className="sr-only">Loading page</span>
    </div>
  );
}

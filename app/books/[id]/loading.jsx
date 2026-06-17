export default function BookLoading() {
  return (
    <section className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[24rem_1fr] lg:px-8" role="status" aria-live="polite">
      <div className="aspect-[3/4] rounded-lg bg-linen shadow-book" />
      <div className="flex flex-col justify-center">
        <div className="h-4 w-36 rounded-full bg-linen" />
        <div className="mt-5 h-12 w-full max-w-2xl rounded-lg bg-linen" />
        <div className="mt-3 h-12 w-3/4 rounded-lg bg-linen" />
        <div className="mt-6 h-5 w-64 rounded-full bg-linen" />
        <div className="mt-8 h-12 w-80 rounded-md bg-linen" />
      </div>
      <span className="sr-only">Loading book</span>
    </section>
  );
}

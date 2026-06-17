import Link from "next/link";
import BookCard from "@/components/BookCard";
import { getHomeData } from "@/lib/books";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function EmptyState({ configured }) {
  return (
    <div className="rounded-lg border border-ink/10 bg-white/65 p-8 text-center">
      <p className="font-display text-3xl font-semibold text-ink">{configured ? "No synced books yet." : "Supabase is not configured yet."}</p>
      <p className="mt-2 text-sm text-ink/65">Run the Open Library sync after applying the Supabase schema. The app does not render placeholder book data.</p>
    </div>
  );
}

export default async function HomePage() {
  const { configured, subjects, featured, recent } = await getHomeData();
  const heroBook = featured[0];

  return (
    <>
      <section className="relative overflow-hidden border-b border-ink/10">
        <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-plum sm:text-sm">Open Library, quietly curated</p>
            <h1 className="mt-5 font-display text-4xl font-bold leading-[0.98] text-ink sm:text-5xl md:text-6xl xl:text-7xl">Find the book that stays with you.</h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-ink/70">React Book is an anonymous discovery shelf powered by Open Library data synced into Supabase, then shaped into warm trails by subject, author, recency, and reader signals.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              {subjects.slice(0, 6).map((subject) => (
                <Link key={subject.id} href={`/category/${subject.slug}`} className="focus-ring cursor-pointer rounded-full border border-ink/15 bg-white/70 px-4 py-2 text-sm font-bold text-ink transition-colors duration-200 hover:border-plum hover:text-plum">
                  {subject.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-lg">
            <div className="absolute inset-8 rotate-6 rounded-lg bg-plum/12" />
            <div className="absolute inset-4 -rotate-3 rounded-lg bg-gilt/15" />
            {heroBook ? (
              <div className="relative">
                <BookCard book={heroBook} />
              </div>
            ) : (
              <div className="relative rounded-lg border border-ink/10 bg-white/70 p-10 shadow-book">
                <p className="font-display text-3xl font-semibold">Your synced shelf will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-plum">Browse by mood and subject</p>
            <h2 className="mt-2 font-display text-3xl font-bold text-ink sm:text-4xl">Living categories</h2>
          </div>
        </div>
        {subjects.length ? (
          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {subjects.map((subject) => (
              <Link key={subject.id} href={`/category/${subject.slug}`} className="focus-ring cursor-pointer rounded-lg border border-ink/10 bg-white/65 p-5 transition-colors duration-200 hover:border-moss hover:bg-white">
                <span className="block font-display text-2xl font-semibold leading-tight text-ink">{subject.name}</span>
                <span className="mt-3 block text-xs font-bold uppercase tracking-[0.18em] text-ink/50">{subject.book_count} books</span>
              </Link>
            ))}
          </div>
        ) : <div className="mt-7"><EmptyState configured={configured} /></div>}
      </section>

      <section className="bg-ink py-12 text-paper">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-gilt">Reader signals</p>
              <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">Featured books</h2>
            </div>
          </div>
          {featured.length ? (
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((book, index) => <BookCard key={book.id} book={book} index={index} />)}
            </div>
          ) : <div className="mt-8"><EmptyState configured={configured} /></div>}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="text-sm font-bold uppercase tracking-[0.24em] text-plum">Fresh from the sync</p>
        <h2 className="mt-2 font-display text-3xl font-bold text-ink sm:text-4xl">Recently added</h2>
        {recent.length ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {recent.map((book) => <BookCard key={book.id} book={book} />)}
          </div>
        ) : <div className="mt-8"><EmptyState configured={configured} /></div>}
      </section>
    </>
  );
}

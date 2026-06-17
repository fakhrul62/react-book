import Link from "next/link";
import { notFound } from "next/navigation";
import BookCard from "@/components/BookCard";
import { getBooksBySubject } from "@/lib/books";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CategoryPage({ params, searchParams }) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const page = Math.max(1, Number(resolvedSearchParams?.page || 1));
  const { configured, subject, books, pageCount } = await getBooksBySubject(resolvedParams.slug, page);

  if (configured && !subject) notFound();

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 border-b border-ink/10 pb-8">
        <Link href="/" className="focus-ring w-fit rounded-md text-sm font-bold text-plum">Back to home</Link>
        <h1 className="font-display text-4xl font-bold leading-tight text-ink sm:text-5xl lg:text-6xl">{subject?.name || "Category"}</h1>
        <p className="max-w-2xl text-sm leading-7 text-ink/65">All books in this subject come from the Supabase cache populated by the Open Library sync pipeline.</p>
      </div>

      {books.length ? (
        <>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {books.map((book, index) => <BookCard key={book.id} book={book} index={(page - 1) * 18 + index} />)}
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-2">
            {Array.from({ length: pageCount }).map((_, index) => {
              const pageNumber = index + 1;
              return (
                <Link key={pageNumber} href={`/category/${resolvedParams.slug}?page=${pageNumber}`} className={`focus-ring grid h-10 min-w-10 cursor-pointer place-items-center rounded-md border px-3 text-sm font-bold transition-colors duration-200 ${pageNumber === page ? "border-ink bg-ink text-paper" : "border-ink/15 bg-white/70 text-ink hover:border-plum hover:text-plum"}`}>
                  {pageNumber}
                </Link>
              );
            })}
          </div>
        </>
      ) : (
        <div className="mt-10 rounded-lg border border-ink/10 bg-white/65 p-8 text-center">
          <p className="font-display text-3xl font-semibold">{configured ? "No books in this subject yet." : "Supabase is not configured yet."}</p>
        </div>
      )}
    </section>
  );
}

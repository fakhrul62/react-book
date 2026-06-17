import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import BookActions from "@/components/BookActions";
import BookCard from "@/components/BookCard";
import { getBookById } from "@/lib/books";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function BookPage({ params }) {
  const resolvedParams = await params;
  const { configured, book, related } = await getBookById(resolvedParams.id);
  if (configured && !book) notFound();

  if (!book) {
    return (
      <section className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h1 className="font-display text-5xl font-bold">Supabase is not configured yet.</h1>
        <p className="mt-3 text-ink/65">Book pages read only from the Supabase cache.</p>
      </section>
    );
  }

  const authors = book.authors?.map((author) => author.name).join(", ") || "Unknown author";

  return (
    <article>
      <section className="border-b border-ink/10">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[24rem_1fr] lg:px-8">
          <div className="relative mx-auto w-full max-w-sm">
            <div className="absolute inset-6 rotate-3 rounded-lg bg-gilt/20" />
            <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-linen shadow-book">
              {book.coverUrl ? <Image src={book.coverUrl} alt={`Cover of ${book.title}`} fill priority sizes="360px" className="object-cover" /> : <div className="flex h-full items-center justify-center p-8 text-center font-display text-4xl text-ink/50">{book.title}</div>}
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-plum">{book.first_publish_year || "Publication year unknown"}</p>
            <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-ink sm:text-5xl lg:text-6xl">{book.title}</h1>
            <p className="mt-5 text-xl text-ink/70">By {authors}</p>
            <div className="mt-7 flex flex-wrap gap-2">
              {book.subjects?.slice(0, 10).map((subject) => (
                <Link key={subject.id} href={`/category/${subject.slug}`} className="focus-ring cursor-pointer rounded-full border border-ink/15 bg-white/70 px-3 py-1.5 text-xs font-bold text-ink transition-colors duration-200 hover:border-plum hover:text-plum">{subject.name}</Link>
              ))}
            </div>
            <div className="mt-8">
              <BookActions book={book} />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_22rem] lg:px-8">
        <div>
          <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">Synopsis</h2>
          <p className="mt-4 whitespace-pre-line text-base leading-8 text-ink/75">{book.description || "No synopsis was available in the synced Open Library data."}</p>
        </div>
        <aside className="rounded-lg border border-ink/10 bg-white/65 p-5">
          <h2 className="font-display text-3xl font-bold">Details</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div><dt className="font-bold text-ink">Pages</dt><dd className="text-ink/65">{book.page_count || book.editions?.find((edition) => edition.page_count)?.page_count || "Unknown"}</dd></div>
            <div><dt className="font-bold text-ink">Language</dt><dd className="text-ink/65">{book.language || "Unknown"}</dd></div>
            <div><dt className="font-bold text-ink">First published</dt><dd className="text-ink/65">{book.first_publish_date || book.first_publish_year || "Unknown"}</dd></div>
            <div><dt className="font-bold text-ink">Rating</dt><dd className="text-ink/65">{book.ratings_average ? `${Number(book.ratings_average).toFixed(2)} from ${book.ratings_count || 0} ratings` : "Not available"}</dd></div>
            <div><dt className="font-bold text-ink">Editions cached</dt><dd className="text-ink/65">{book.editions?.length || 0}</dd></div>
          </dl>
        </aside>
      </section>

      {related.length ? (
        <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-plum">Shared subjects</p>
          <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">Similar books</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((item) => <BookCard key={item.id} book={item} />)}
          </div>
        </section>
      ) : null}
    </article>
  );
}

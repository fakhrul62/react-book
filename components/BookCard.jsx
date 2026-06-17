import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/Icon";

export default function BookCard({ book, index }) {
  const authors = book.authors?.map((author) => author.name).join(", ") || "Unknown author";
  const subject = book.subjects?.[0]?.name || "General reading";

  return (
    <Link href={`/books/${book.id}`} className="group focus-ring block cursor-pointer rounded-lg">
      <article className="h-full rounded-lg border border-ink/10 bg-white/72 p-4 shadow-book transition-colors duration-200 hover:border-plum/50">
        <div className="relative aspect-[3/4] overflow-hidden rounded-md bg-linen">
          {book.coverUrl ? (
            <Image src={book.coverUrl} alt={`Cover of ${book.title}`} fill sizes="(max-width: 768px) 45vw, 220px" className="object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
          ) : (
            <div className="flex h-full items-center justify-center px-6 text-center font-display text-xl text-ink/45">{book.title}</div>
          )}
          {typeof index === "number" ? (
            <span className="absolute left-3 top-3 rounded-full bg-ink px-2 py-1 text-xs text-paper">{String(index + 1).padStart(2, "0")}</span>
          ) : null}
        </div>
        <div className="mt-4 space-y-3">
          <div>
            <h3 className="line-clamp-2 font-display text-xl font-semibold leading-tight text-ink">{book.title}</h3>
            <p className="mt-1 line-clamp-1 text-sm text-ink/65">{authors}</p>
          </div>
          <div className="flex items-center justify-between gap-3 text-xs text-ink/65">
            <span className="flex min-w-0 items-center gap-1">
              <Icon name="book" className="h-4 w-4 shrink-0" />
              <span className="truncate">{subject}</span>
            </span>
            {book.ratings_average ? <span>{Number(book.ratings_average).toFixed(1)}</span> : null}
          </div>
        </div>
      </article>
    </Link>
  );
}

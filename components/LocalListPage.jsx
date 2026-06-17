"use client";

import { useEffect, useState } from "react";
import BookCard from "@/components/BookCard";
import ExportTools from "@/components/ExportTools";
import LocalStorageNotice from "@/components/LocalStorageNotice";
import { Icon } from "@/components/Icon";
import { readList, removeFromList } from "@/lib/localList";

export default function LocalListPage({ storageKey, title, kicker }) {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shared = params.get("share");
    if (shared) {
      try {
        setBooks(JSON.parse(decodeURIComponent(escape(atob(shared)))));
        return;
      } catch {}
    }
    setBooks(readList(storageKey));
  }, [storageKey]);

  function remove(id) {
    removeFromList(storageKey, id);
    setBooks(readList(storageKey));
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[1fr_22rem] lg:items-end">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-plum">{kicker}</p>
          <h1 className="mt-3 font-display text-4xl font-bold leading-tight text-ink sm:text-5xl lg:text-6xl">{title}</h1>
        </div>
        <div className="space-y-4">
          <LocalStorageNotice />
          <ExportTools title={title} books={books} />
        </div>
      </div>

      {books.length ? (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {books.map((book, index) => (
            <div key={book.id} className="relative">
              <BookCard book={book} index={index} />
              <button onClick={() => remove(book.id)} aria-label={`Remove ${book.title}`} className="focus-ring absolute right-3 top-3 grid h-9 w-9 cursor-pointer place-items-center rounded-full bg-white/90 text-ink shadow transition-colors duration-200 hover:text-plum">
                <Icon name="x" className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-lg border border-ink/10 bg-white/60 p-10 text-center">
          <p className="font-display text-3xl font-semibold text-ink">No books saved here yet.</p>
          <p className="mt-2 text-sm text-ink/65">Open a book page and add it to this list.</p>
        </div>
      )}
    </section>
  );
}

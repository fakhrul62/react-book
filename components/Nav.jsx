"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/Icon";

function useDebounced(value, delay = 250) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const debounced = useDebounced(query);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (debounced.trim().length < 2) {
      setResults([]);
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    fetch(`/api/search?q=${encodeURIComponent(debounced)}`, { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => setResults(data.books || []))
      .catch(() => {})
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [debounced]);

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/88 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="focus-ring flex shrink-0 items-center gap-3 rounded-md">
          <span className="grid h-10 w-10 place-items-center rounded-md bg-ink text-paper"><Icon name="book" className="h-5 w-5" /></span>
          <span className="font-display text-3xl font-bold leading-none text-ink">React Book</span>
        </Link>

        <div className="ml-auto flex items-center gap-2">
          <div className="relative">
            <button onClick={() => setOpen((value) => !value)} aria-label="Search books" className="focus-ring grid h-10 w-10 cursor-pointer place-items-center rounded-md border border-ink/15 bg-white/70 text-ink transition-colors duration-200 hover:border-plum hover:text-plum">
              <Icon name="search" />
            </button>
            {open ? (
              <div className="absolute right-0 top-12 w-[calc(100vw-2rem)] max-w-md rounded-lg border border-ink/10 bg-white p-3 shadow-book sm:w-96">
                <label className="sr-only" htmlFor="book-search">Search books</label>
                <input
                  id="book-search"
                  ref={inputRef}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search synced books..."
                  className="focus-ring w-full rounded-md border border-ink/15 bg-paper px-3 py-3 text-sm text-ink placeholder:text-ink/45"
                />
                <div className="mt-3 max-h-96 overflow-y-auto">
                  {loading ? <p className="px-2 py-3 text-sm text-ink/60">Searching...</p> : null}
                  {!loading && query.trim().length >= 2 && results.length === 0 ? <p className="px-2 py-3 text-sm text-ink/60">No synced books found.</p> : null}
                  {results.map((book) => (
                    <Link key={book.id} href={`/books/${book.id}`} onClick={() => setOpen(false)} className="focus-ring flex cursor-pointer gap-3 rounded-md p-2 transition-colors duration-200 hover:bg-linen">
                      <div className="h-14 w-10 shrink-0 rounded bg-linen" style={book.coverUrl ? { backgroundImage: `url(${book.coverUrl})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined} />
                      <div className="min-w-0">
                        <p className="truncate font-display text-xl font-semibold leading-tight">{book.title}</p>
                        <p className="truncate text-xs text-ink/60">{book.authors?.map((author) => author.name).join(", ") || "Unknown author"}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <Link href="/wishlist" className="focus-ring hidden cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm font-bold text-ink transition-colors duration-200 hover:bg-linen sm:inline-flex">
            <Icon name="heart" className="h-4 w-4" />
            Wishlist
          </Link>
          <Link href="/readlist" className="focus-ring hidden cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm font-bold text-ink transition-colors duration-200 hover:bg-linen sm:inline-flex">
            <Icon name="bookmark" className="h-4 w-4" />
            Readlist
          </Link>
          <Link href="/wishlist" aria-label="Wishlist" className="focus-ring grid h-10 w-10 cursor-pointer place-items-center rounded-md border border-ink/15 bg-white/70 text-ink sm:hidden"><Icon name="heart" /></Link>
          <Link href="/readlist" aria-label="Readlist" className="focus-ring grid h-10 w-10 cursor-pointer place-items-center rounded-md border border-ink/15 bg-white/70 text-ink sm:hidden"><Icon name="bookmark" /></Link>
        </div>
      </nav>
    </header>
  );
}

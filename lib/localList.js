"use client";

export const WISHLIST_KEY = "wishlist";
export const READLIST_KEY = "booksRead";

export function toStoredBook(book) {
  return {
    id: book.id,
    title: book.title,
    authors: book.authors || [],
    coverUrl: book.coverUrl || null,
    subjects: book.subjects || [],
    first_publish_year: book.first_publish_year || null,
    ratings_average: book.ratings_average || null
  };
}

export function readList(key) {
  if (typeof window === "undefined") return [];
  try {
    const value = JSON.parse(window.localStorage.getItem(key) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

export function writeList(key, books) {
  window.localStorage.setItem(key, JSON.stringify(books));
  window.dispatchEvent(new Event("book-lists-updated"));
}

export function addWishlist(book) {
  const stored = toStoredBook(book);
  const wishlist = readList(WISHLIST_KEY);
  const readlist = readList(READLIST_KEY);
  if (readlist.some((item) => item.id === stored.id)) return "already-read";
  if (wishlist.some((item) => item.id === stored.id)) return "duplicate";
  writeList(WISHLIST_KEY, [...wishlist, stored]);
  return "added";
}

export function addReadlist(book) {
  const stored = toStoredBook(book);
  const readlist = readList(READLIST_KEY);
  if (readlist.some((item) => item.id === stored.id)) return "duplicate";
  writeList(READLIST_KEY, [...readlist, stored]);
  writeList(WISHLIST_KEY, readList(WISHLIST_KEY).filter((item) => item.id !== stored.id));
  return "added";
}

export function removeFromList(key, id) {
  writeList(key, readList(key).filter((item) => item.id !== id));
}

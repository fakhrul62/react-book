import { NextResponse } from "next/server";
import { searchBooks } from "@/lib/books";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const books = await searchBooks(searchParams.get("q") || "");
  return NextResponse.json({ books });
}

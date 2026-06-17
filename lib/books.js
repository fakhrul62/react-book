import { getSupabaseClient, hasSupabaseConfig } from "@/lib/supabase/server";

const BOOK_SELECT = `
  id,
  open_library_work_key,
  title,
  subtitle,
  description,
  first_publish_year,
  first_publish_date,
  page_count,
  language,
  cover_id,
  ratings_average,
  ratings_count,
  created_at,
  updated_at,
  book_authors(authors(id, name, open_library_key)),
  book_subjects(subjects(id, name, slug)),
  editions(id, open_library_key, title, publisher, publish_date, page_count, language, cover_id)
`;

export const PAGE_SIZE = 18;

export function coverUrl(coverId, size = "L") {
  return coverId ? `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg` : null;
}

export function normalizeBook(row) {
  if (!row) return null;

  return {
    ...row,
    authors: (row.book_authors || []).map((item) => item.authors).filter(Boolean),
    subjects: (row.book_subjects || []).map((item) => item.subjects).filter(Boolean),
    editions: row.editions || [],
    coverUrl: coverUrl(row.cover_id)
  };
}

function emptyResult(extra = {}) {
  return { configured: hasSupabaseConfig(), books: [], error: null, ...extra };
}

export async function getHomeData() {
  const supabase = getSupabaseClient();
  if (!supabase) return emptyResult({ subjects: [], featured: [], recent: [] });

  const [subjectsResult, featuredResult, recentResult] = await Promise.all([
    supabase.from("subjects").select("id,name,slug,book_subjects(count)").order("book_count", { ascending: false }).limit(12),
    supabase.from("books").select(BOOK_SELECT).order("ratings_count", { ascending: false, nullsFirst: false }).limit(8),
    supabase.from("books").select(BOOK_SELECT).order("created_at", { ascending: false }).limit(8)
  ]);

  return {
    configured: true,
    subjects: subjectsResult.data || [],
    featured: (featuredResult.data || []).map(normalizeBook),
    recent: (recentResult.data || []).map(normalizeBook),
    error: subjectsResult.error || featuredResult.error || recentResult.error || null
  };
}

export async function getBookById(id) {
  const supabase = getSupabaseClient();
  if (!supabase) return { configured: false, book: null, related: [], error: null };

  const { data, error } = await supabase.from("books").select(BOOK_SELECT).eq("id", id).single();
  const book = normalizeBook(data);
  let related = [];

  if (book?.subjects?.length) {
    const subjectIds = book.subjects.slice(0, 4).map((subject) => subject.id);
    const { data: links } = await supabase
      .from("book_subjects")
      .select("book_id")
      .neq("book_id", id)
      .in("subject_id", subjectIds)
      .limit(12);
    const ids = [...new Set((links || []).map((link) => link.book_id))].slice(0, 6);
    if (ids.length) {
      const relatedResult = await supabase.from("books").select(BOOK_SELECT).in("id", ids).limit(6);
      related = (relatedResult.data || []).map(normalizeBook);
    }
  }

  return { configured: true, book, related, error };
}

export async function getBooksBySubject(slug, page = 1) {
  const supabase = getSupabaseClient();
  if (!supabase) return emptyResult({ subject: null, total: 0, pageCount: 0 });

  const { data: subject, error: subjectError } = await supabase.from("subjects").select("*").eq("slug", slug).single();
  if (!subject) return { configured: true, subject: null, books: [], total: 0, pageCount: 0, error: subjectError };

  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;
  const linksResult = await supabase
    .from("book_subjects")
    .select("book_id", { count: "exact" })
    .eq("subject_id", subject.id)
    .range(from, to);
  const ids = (linksResult.data || []).map((link) => link.book_id);
  const booksResult = ids.length
    ? await supabase.from("books").select(BOOK_SELECT).in("id", ids).order("ratings_count", { ascending: false, nullsFirst: false })
    : { data: [], error: null };

  return {
    configured: true,
    subject,
    books: (booksResult.data || []).map(normalizeBook),
    total: linksResult.count || 0,
    pageCount: Math.max(1, Math.ceil((linksResult.count || 0) / PAGE_SIZE)),
    error: linksResult.error || booksResult.error
  };
}

export async function searchBooks(query) {
  const supabase = getSupabaseClient();
  const term = query?.trim();
  if (!supabase || !term) return [];

  const safeTerm = term.replace(/[,()%]/g, " ");
  const { data } = await supabase
    .from("books")
    .select(BOOK_SELECT)
    .or(`title.ilike.%${safeTerm}%,description.ilike.%${safeTerm}%`)
    .order("ratings_count", { ascending: false, nullsFirst: false })
    .limit(8);

  return (data || []).map(normalizeBook);
}

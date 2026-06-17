import { getSupabaseClient } from "@/lib/supabase/server";
import https from "node:https";

const OPEN_LIBRARY = "https://openlibrary.org";
const SUBJECT_SEEDS = [
  "fiction",
  "fantasy",
  "science fiction",
  "romance",
  "history",
  "biography",
  "mystery",
  "children",
  "poetry",
  "philosophy"
];

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

function slugHash(value) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }
  return hash.toString(36).slice(0, 6);
}

async function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const request = https.get(url, {
      headers: {
        "User-Agent": "ReactBookSync/1.0 (Open Library cache refresh)"
      },
      timeout: 30000
    }, (response) => {
      let body = "";

      response.setEncoding("utf8");
      response.on("data", (chunk) => {
        body += chunk;
      });
      response.on("end", () => {
        if (response.statusCode < 200 || response.statusCode >= 300) {
          reject(new Error(`Open Library request failed: ${response.statusCode} ${url}`));
          return;
        }

        try {
          resolve(JSON.parse(body));
        } catch (error) {
          reject(error);
        }
      });
    });

    request.on("timeout", () => {
      request.destroy(new Error(`Open Library request timed out: ${url}`));
    });
    request.on("error", reject);
  });
}

function descriptionFromWork(work) {
  if (!work?.description) return null;
  return typeof work.description === "string" ? work.description : work.description.value || null;
}

function coverRows(bookId, editionId, coverId) {
  if (!coverId) return [];
  return ["S", "M", "L"].map((size) => ({
    book_id: bookId,
    edition_id: editionId,
    open_library_cover_id: coverId,
    size,
    url: `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`
  }));
}

async function upsertSubject(supabase, name) {
  const clean = name.trim();
  if (!clean) return null;
  const existing = await supabase.from("subjects").select("id").eq("name", clean).maybeSingle();
  if (existing.data) return existing.data;

  const baseSlug = slugify(clean);
  const slugCheck = await supabase.from("subjects").select("id").eq("slug", baseSlug).maybeSingle();
  const slug = slugCheck.data ? `${baseSlug.slice(0, 82)}-${slugHash(clean)}` : baseSlug;

  const { data, error } = await supabase
    .from("subjects")
    .upsert({ name: clean, slug }, { onConflict: "name" })
    .select("id")
    .single();
  if (error) throw error;
  return data;
}

async function upsertAuthor(supabase, name, key) {
  const clean = name?.trim();
  if (!clean) return null;
  const { data, error } = await supabase
    .from("authors")
    .upsert({ name: clean, open_library_key: key || null }, { onConflict: "open_library_key" })
    .select("id")
    .single();
  if (error) throw error;
  return data;
}

async function syncOneDoc(supabase, doc) {
  const workKey = doc.key;
  if (!workKey || !doc.title) return false;

  const [work, editions] = await Promise.all([
    fetchJson(`${OPEN_LIBRARY}${workKey}.json`).catch(() => null),
    fetchJson(`${OPEN_LIBRARY}${workKey}/editions.json?limit=10`).catch(() => ({ entries: [] }))
  ]);

  const firstEdition = editions.entries?.[0] || {};
  const coverId = doc.cover_i || firstEdition.covers?.[0] || null;
  const pageCount = doc.number_of_pages_median || firstEdition.number_of_pages || null;
  const language = doc.language?.[0] || firstEdition.languages?.[0]?.key?.split("/").pop() || null;

  const { data: book, error: bookError } = await supabase
    .from("books")
    .upsert({
      open_library_work_key: workKey,
      title: doc.title,
      subtitle: doc.subtitle || null,
      description: descriptionFromWork(work),
      first_publish_year: doc.first_publish_year || null,
      first_publish_date: firstEdition.publish_date || null,
      page_count: pageCount,
      language,
      cover_id: coverId,
      ratings_average: doc.ratings_average || null,
      ratings_count: doc.ratings_count || null,
      source_payload: doc,
      updated_at: new Date().toISOString()
    }, { onConflict: "open_library_work_key" })
    .select("id")
    .single();

  if (bookError) throw bookError;

  const authorNames = doc.author_name || [];
  const authorKeys = doc.author_key || [];
  for (let index = 0; index < Math.min(authorNames.length, 6); index += 1) {
    const author = await upsertAuthor(supabase, authorNames[index], authorKeys[index] ? `/authors/${authorKeys[index]}` : null);
    if (author) {
      await supabase.from("book_authors").upsert({ book_id: book.id, author_id: author.id }, { onConflict: "book_id,author_id" });
    }
  }

  const subjects = [...new Set([...(doc.subject || []), ...(doc.person || []), ...(doc.place || [])])]
    .filter((subject) => subject.length <= 80)
    .slice(0, 18);

  for (const name of subjects) {
    const subject = await upsertSubject(supabase, name);
    if (subject) {
      await supabase.from("book_subjects").upsert({ book_id: book.id, subject_id: subject.id }, { onConflict: "book_id,subject_id" });
    }
  }

  for (const edition of editions.entries?.slice(0, 8) || []) {
    const editionCover = edition.covers?.[0] || coverId;
    const { data: savedEdition } = await supabase
      .from("editions")
      .upsert({
        book_id: book.id,
        open_library_key: edition.key,
        title: edition.title || doc.title,
        publisher: edition.publishers?.[0] || null,
        publish_date: edition.publish_date || null,
        page_count: edition.number_of_pages || null,
        language: edition.languages?.[0]?.key?.split("/").pop() || null,
        cover_id: editionCover || null
      }, { onConflict: "open_library_key" })
      .select("id")
      .single();

    const covers = coverRows(book.id, savedEdition?.id || null, editionCover);
    if (covers.length) {
      await supabase.from("covers").upsert(covers, { onConflict: "book_id,open_library_cover_id,size" });
    }
  }

  return true;
}

async function refreshSubjectCounts(supabase) {
  const { data: subjects } = await supabase.from("subjects").select("id");
  for (const subject of subjects || []) {
    const { count } = await supabase.from("book_subjects").select("*", { count: "exact", head: true }).eq("subject_id", subject.id);
    await supabase.from("subjects").update({ book_count: count || 0 }).eq("id", subject.id);
  }
}

export async function runOpenLibrarySync({ limitPerSubject = 20 } = {}) {
  const supabase = getSupabaseClient({ service: true });
  if (!supabase) {
    throw new Error("Missing Supabase service configuration.");
  }

  let synced = 0;
  const errors = [];
  for (const subject of SUBJECT_SEEDS) {
    try {
      const search = await fetchJson(`${OPEN_LIBRARY}/search.json?subject=${encodeURIComponent(subject)}&limit=${limitPerSubject}&fields=key,title,subtitle,author_name,author_key,cover_i,subject,person,place,first_publish_year,number_of_pages_median,language,ratings_average,ratings_count`);
      for (const doc of search.docs || []) {
        if (await syncOneDoc(supabase, doc)) synced += 1;
      }
    } catch (error) {
      errors.push({ subject, message: error.message });
    }
  }

  await refreshSubjectCounts(supabase);
  return { synced, errors };
}

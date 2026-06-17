create extension if not exists pg_trgm;

create table if not exists authors (
  id bigserial primary key,
  open_library_key text unique,
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists books (
  id bigserial primary key,
  open_library_work_key text not null unique,
  title text not null,
  subtitle text,
  description text,
  first_publish_year integer,
  first_publish_date text,
  page_count integer,
  language text,
  cover_id integer,
  ratings_average numeric(4,2),
  ratings_count integer,
  source_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists book_authors (
  book_id bigint not null references books(id) on delete cascade,
  author_id bigint not null references authors(id) on delete cascade,
  primary key (book_id, author_id)
);

create table if not exists subjects (
  id bigserial primary key,
  name text not null unique,
  slug text not null unique,
  book_count integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists book_subjects (
  book_id bigint not null references books(id) on delete cascade,
  subject_id bigint not null references subjects(id) on delete cascade,
  primary key (book_id, subject_id)
);

create table if not exists editions (
  id bigserial primary key,
  book_id bigint not null references books(id) on delete cascade,
  open_library_key text unique,
  title text,
  publisher text,
  publish_date text,
  page_count integer,
  language text,
  cover_id integer
);

create table if not exists covers (
  id bigserial primary key,
  book_id bigint not null references books(id) on delete cascade,
  edition_id bigint references editions(id) on delete cascade,
  open_library_cover_id integer not null,
  size text,
  url text not null,
  unique (book_id, open_library_cover_id, size)
);

create index if not exists books_title_trgm_idx on books using gin (title gin_trgm_ops);
create index if not exists books_description_trgm_idx on books using gin (description gin_trgm_ops);
create index if not exists books_ratings_count_idx on books (ratings_count desc nulls last);
create index if not exists books_created_at_idx on books (created_at desc);
create index if not exists subjects_slug_idx on subjects (slug);
create index if not exists subjects_book_count_idx on subjects (book_count desc);
create index if not exists book_subjects_subject_id_idx on book_subjects (subject_id);
create index if not exists editions_book_id_idx on editions (book_id);

alter table authors enable row level security;
alter table books enable row level security;
alter table book_authors enable row level security;
alter table subjects enable row level security;
alter table book_subjects enable row level security;
alter table editions enable row level security;
alter table covers enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'authors' and policyname = 'public read authors') then
    create policy "public read authors" on authors for select using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'books' and policyname = 'public read books') then
    create policy "public read books" on books for select using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'book_authors' and policyname = 'public read book authors') then
    create policy "public read book authors" on book_authors for select using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'subjects' and policyname = 'public read subjects') then
    create policy "public read subjects" on subjects for select using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'book_subjects' and policyname = 'public read book subjects') then
    create policy "public read book subjects" on book_subjects for select using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'editions' and policyname = 'public read editions') then
    create policy "public read editions" on editions for select using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'covers' and policyname = 'public read covers') then
    create policy "public read covers" on covers for select using (true);
  end if;
end $$;

# React Book

React Book is a modern anonymous book-discovery platform built with Next.js App Router, Tailwind CSS, and Supabase.

## What Changed

- No authentication, login, or registration.
- Book pages, homepage sections, category pages, and search read from Supabase only.
- Open Library is called only by the scheduled sync route at `/api/sync/open-library`.
- Wishlist and Readlist are stored in browser `localStorage` only.
- Wishlist/Readlist support remove, copy as plain text, export as PDF, and copy a shareable link.

## Data Setup

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the Supabase SQL editor.
3. Copy `.env.example` to `.env.local` and fill:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
CRON_SECRET=
```

4. Start the app:

```bash
npm install
npm run dev
```

5. Trigger the first sync:

```bash
curl -H "Authorization: Bearer YOUR_CRON_SECRET" http://localhost:3000/api/sync/open-library
```

The app intentionally shows empty operational states until Supabase contains synced Open Library data.

## Scheduled Sync

`vercel.json` schedules `/api/sync/open-library` daily at 03:00 UTC. Set `CRON_SECRET` in Vercel and configure the same bearer token for protected manual calls.

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run start
```

## Storage Note

Wishlist and Readlist data never leaves the browser. It is not synced across devices and can be lost if browser data is cleared.

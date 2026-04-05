# Story 3.4: Content Migration & Hobby Retirement

Status: done

## Story

As a site owner,
I want existing tech/AI blog posts migrated to the new content system and hobby content removed,
so that the site launches with a body of professional content that reinforces my consulting brand.

## Acceptance Criteria

1. **Given** existing tech/AI posts on the main branch
   **When** migrated
   **Then** frontmatter is updated to match new schema (title, date, summary, hero)
   **And** hero images are downloaded from Cloudinary and co-located with each post
   **And** post content body is preserved as-is
   **And** all migrated posts build successfully and render at `/blog/[slug]`

2. **Given** existing chess, woodworking, and hobby content
   **When** migration is complete
   **Then** all hobby posts are removed entirely
   **And** no hobby content appears in the blog listing or anywhere on the site

3. **Given** all migrated posts
   **When** the site builds
   **Then** build completes without errors
   **And** all post images are optimized via Astro's image pipeline (no Cloudinary references)

## Tasks / Subtasks

- [x] Task 1: Extract old posts from main branch (AC: #1)
  - [x] Read all old post files from main branch via git show
  - [x] Identify tech/AI posts (9 posts) vs hobby posts (2 posts to retire)
  - [x] Extract frontmatter and content body for each tech/AI post

- [x] Task 2: Download and co-locate hero images (AC: #1, #3)
  - [x] Download each Cloudinary hero image URL (9 hero images)
  - [x] Download inline body images from 3 posts (8 additional images)
  - [x] Save as co-located files in new post directory structure
  - [x] Verify all images are valid (non-zero size)

- [x] Task 3: Create migrated posts with new schema (AC: #1)
  - [x] Create directory structure: `src/content/posts/{slug}/index.md` + hero image
  - [x] Update frontmatter: title, date, summary, hero (relative path)
  - [x] Remove `categories` and `attrib` fields
  - [x] Preserve content body, updating inline Cloudinary URLs to local paths
  - [x] Polished summaries for all posts

- [x] Task 4: Remove sample post and hobby content (AC: #2)
  - [x] Remove `src/content/posts/sample-post/` (test placeholder from Story 3.1)
  - [x] Verify no hobby posts exist in the new content directory (0 chess/woodworking)

- [x] Task 5: Verify build and rendering (AC: #1, #2, #3)
  - [x] Run `pnpm build` — 13 pages, 0 errors, 941ms
  - [x] Verify all 9 migrated posts render at `/blog/[slug]`
  - [x] Verify blog listing shows all posts sorted by date (newest first)
  - [x] Verify zero Cloudinary URLs remain in any content
  - [x] Verify 9 hero images optimized to WebP in build output

## Dev Notes

### Posts to Migrate (9 tech/AI posts)

All from `main` branch `src/content/posts/`:
1. `2022-10-03-AI-Advantages.md` — "Real Advantages of AI" (ai)
2. `2022-08-12-GDF-capture-numbers.md` — "Google DialogFlow – capturing numbers with voice" (ai)
3. `2022-08-20-blog-creation.md` — "Creating a new blog with Jekyll and GitHub Pages" (programming)
4. `2022-10-04-Rpi-Thermostat.md` — "Raspberry Pi Wireless Thermostat - in Rust" (programming)
5. `2022-10-17-Rust-Cross-Compiling-Made-Easy.md` — "Rust Cross Compiling Made Easy" (programming)
6. `2022-10-31-Easy-Multithreaded-Shared-Memory-in-Rust.md` — "Easy multi-threaded shared memory in rust" (programming)
7. `2022-11-09-Why-Rust-Is-So-Great-1.md` — "Why Rust is so Great – Reason 1, The Borrow Checker" (programming)
8. `2022-11-18-Use-Rust-to-Build-Lambda.md` — "Rust, Lambda, and DynamoDB" (programming)
9. `2023-04-09-rust-error-handling.md` — "Rust's great error handling capability." (programming)

### Posts to Retire (2 hobby posts)

1. `2021-08-24-OneFinity-Hitachi-VFD.md` — "Hitachi VFD for OneFinity CNC" (woodworking)
2. `2022-06-03-why-i-play-chess.md` — "Why I Play Chess" (chess)

### New Directory Structure

Each migrated post becomes: `src/content/posts/{slug}/index.md` + `hero.{ext}`

Slug derivation: strip date prefix and extension from old filename:
- `2022-10-03-AI-Advantages.md` → `ai-advantages/`
- Use lowercase slugs

### Old Frontmatter → New Frontmatter

Old:
```yaml
title: "Post Title"
date: 2022-10-03
categories: ai
hero: https://res.cloudinary.com/...
summary: "Summary text"
attrib: "optional attribution"
```

New:
```yaml
title: "Post Title"
date: 2022-10-03
summary: "Summary text"
hero: ./hero.jpg
```

Remove: `categories`, `attrib`
Keep: `title`, `date`, `summary`
Change: `hero` from Cloudinary URL to relative co-located path

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 3.4]
- [Source: _bmad-output/planning-artifacts/prd.md#Content Migration]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (1M context)

### Debug Log References

- 11 posts on main branch: 9 tech/AI + 2 hobby
- All 9 hero images + 8 inline body images downloaded from Cloudinary
- All Cloudinary URL references replaced with relative local paths
- Build: 13 pages, 9 optimized images, 0 errors, 941ms
- Blog listing verified: 9 posts sorted newest-first

### Completion Notes List

- Migrated 9 tech/AI posts from main branch to new content collection format
- Retired 2 hobby posts (chess, woodworking) — not migrated
- Removed sample-post placeholder from Story 3.1
- Downloaded and co-located all images (hero + inline body images)
- Updated all Cloudinary URLs to local relative paths in post bodies
- Frontmatter updated: categories/attrib removed, hero changed to relative path
- All posts build and render correctly at /blog/[slug]

### File List

- `src/content/posts/ai-advantages/` (NEW) — Post + hero + 4 inline images
- `src/content/posts/blog-creation/` (NEW) — Post + hero
- `src/content/posts/easy-multithreaded-shared-memory-in-rust/` (NEW) — Post + hero
- `src/content/posts/gdf-capture-numbers/` (NEW) — Post + hero
- `src/content/posts/rpi-thermostat/` (NEW) — Post + hero + 1 inline image
- `src/content/posts/rust-cross-compiling-made-easy/` (NEW) — Post + hero
- `src/content/posts/rust-error-handling/` (NEW) — Post + hero
- `src/content/posts/use-rust-to-build-lambda/` (NEW) — Post + hero + 3 inline images
- `src/content/posts/why-rust-is-so-great-1/` (NEW) — Post + hero
- `src/content/posts/sample-post/` (DELETED) — Removed placeholder

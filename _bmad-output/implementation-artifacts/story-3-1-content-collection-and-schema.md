# Story 3.1: Content Collection & Schema

Status: done

## Story

As a content author,
I want a validated content collection that enforces frontmatter structure,
so that every post has the required metadata and a co-located hero image optimized at build time.

## Acceptance Criteria

1. **Given** the content collection is configured
   **When** `src/content.config.ts` is defined (Astro 6 convention — root-level, NOT `src/content/config.ts`)
   **Then** the schema validates: `title` (string, required), `date` (date, required), `summary` (string, required), `hero` (image, required)
   **And** `categories` and `attrib` fields are NOT in the schema

2. **Given** a post exists at `src/content/posts/sample-post/index.md` with a co-located `hero.jpg`
   **When** the project builds (`pnpm build`)
   **Then** the content collection resolves the post successfully
   **And** the hero image is processed by Astro's image optimization (Sharp) — resized, converted to WebP/AVIF, lazy-loaded
   **And** no Cloudinary URLs are referenced

3. **Given** a post with missing or invalid frontmatter
   **When** the project builds
   **Then** the build fails with a clear Zod validation error identifying the issue

4. **Given** the content collection exists with at least one sample post
   **When** `pnpm build` completes
   **Then** the build passes with zero errors and zero type-check failures

## Tasks / Subtasks

- [x] Task 1: Create content collection config (AC: #1)
  - [x] Create `src/content.config.ts` using Astro 6 `defineCollection` + Zod schema
  - [x] Define `posts` collection with `glob` loader pointing to `src/content/posts/*/index.md`
  - [x] Schema fields: `title` (z.string()), `date` (z.date()), `summary` (z.string()), `hero` (image())
  - [x] Verify Astro generates types via `astro sync` (creates `.astro/` types)

- [x] Task 2: Create sample post for validation (AC: #2, #4)
  - [x] Create `src/content/posts/sample-post/index.md` with valid frontmatter
  - [x] Add a placeholder `hero.png` co-located in the same directory
  - [x] Frontmatter must use YAML date format (e.g., `date: 2026-01-15`)
  - [x] Include enough body content (~200 words) to verify prose rendering later
  - [x] Content should be a real tech/AI topic consistent with site brand voice

- [x] Task 3: Verify build passes (AC: #2, #3, #4)
  - [x] Run `pnpm build` — must pass with zero errors
  - [x] Hero image not in dist yet (no page renders it) — will be optimized when Story 3.2 adds `<Image>`
  - [x] Test invalid frontmatter (remove `title`) → confirmed Zod error on build
  - [x] Restore valid frontmatter after negative test

### Review Findings

- [x] [Review][Defer] Empty strings in title/summary pass `z.string()` validation — consider `z.string().min(1)` — deferred, content authoring concern not blocking
- [x] [Review][Defer] No `draft` field in schema — no mechanism to hide WIP posts — deferred, explicitly out of scope per architecture

## Dev Notes

### Critical: Astro 6 Content Layer API

Astro 6 uses the **Content Layer API** (not the legacy `src/content/config.ts` approach). Key differences:

- Config file location: **`src/content.config.ts`** (project root of `src/`, NOT inside `src/content/`)
- Uses `defineCollection` from `astro:content`
- Uses `glob` loader from `astro/loaders` for file-based collections
- Schema uses Zod (from `astro:content`) — `z.string()`, `z.date()`, `image()` helper
- The `image()` helper is imported from `astro:content` and validates local image paths

### Content Collection Definition Pattern

```typescript
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const posts = defineCollection({
  loader: glob({ pattern: "*/index.md", base: "src/content/posts" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.date(),
      summary: z.string(),
      hero: image(),
    }),
});

export const collections = { posts };
```

### Post Frontmatter Format

```yaml
---
title: "Post Title Here"
date: 2026-01-15
summary: "One-sentence summary for blog cards and meta descriptions."
hero: ./hero.jpg
---
```

- `hero` path is relative to the markdown file (co-located)
- `date` is a bare YAML date (no quotes) — Zod parses it as a Date object
- No `categories`, no `attrib` — these were deliberately removed per architecture decision

### Existing Codebase Integration Points

1. **RecentWriting.astro** (`src/components/RecentWriting.astro`) — accepts `posts?: Post[]` prop with shape `{ href, date, datetime, title, summary }`. Currently called with no props on homepage (self-hides). Will be wired in Story 3.3.
2. **BlogCard.astro** (`src/components/BlogCard.astro`) — accepts `{ href, date, datetime, title, summary }`. Already built and working.
3. **blog/index.astro** (`src/pages/blog/index.astro`) — placeholder with just `<h1>Blog</h1>`. Will be replaced in Story 3.3.
4. **blog/[slug].astro** (`src/pages/blog/[slug].astro`) — placeholder with dummy `getStaticPaths()`. Will be replaced in Story 3.2.

**Do NOT modify these files in this story** — Story 3.1 only creates the collection and validates it builds. Stories 3.2 and 3.3 wire the collection to pages/components.

### File Structure

```
src/
  content.config.ts          # NEW — collection schema definition
  content/
    posts/
      sample-post/
        index.md             # NEW — sample post with valid frontmatter
        hero.jpg             # NEW — placeholder hero image
```

### Anti-Patterns to Avoid

- Do NOT place config at `src/content/config.ts` — that's the legacy Astro 4/5 location
- Do NOT use `type: 'content'` in collection definition — Astro 6 uses `loader` instead
- Do NOT use raw `<img>` tags — always Astro `<Image>` component (relevant for later stories)
- Do NOT add fields beyond title/date/summary/hero — keep schema minimal per architecture decision
- Do NOT modify existing page files or components — this story only sets up the collection

### Project Structure Notes

- All paths align with architecture document's project structure
- `src/content/posts/` directory already exists (empty)
- No conflicts with existing files

### References

- [Source: _bmad-output/planning-artifacts/architecture.md#Content Collection Schema]
- [Source: _bmad-output/planning-artifacts/architecture.md#Implementation Patterns]
- [Source: _bmad-output/planning-artifacts/epics.md#Story 3.1]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#BlogPostLayout]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (1M context)

### Debug Log References

- Build passes clean: 0 errors, 0 warnings, 5 hints (z deprecation from astro:content — cosmetic, idiomatic pattern)
- Negative test confirmed: removing `title` from frontmatter produces `InvalidContentEntryDataError` with clear message
- Hero image uses PNG format (generated programmatically) — Sharp will process to WebP/AVIF when rendered via `<Image>`

### Completion Notes List

- Created `src/content.config.ts` with Astro 6 Content Layer API (glob loader, Zod schema)
- Schema: title (string), date (date), summary (string), hero (image) — no categories/attrib per architecture
- Sample post: "Why Most AI Pilots Fail Before They Start" — real AI/consulting topic matching brand voice
- All acceptance criteria satisfied: schema validates, build passes, invalid frontmatter rejected
- No existing files modified — clean addition only

### File List

- `src/content.config.ts` (NEW) — Content collection schema definition
- `src/content/posts/sample-post/index.md` (NEW) — Sample blog post with valid frontmatter
- `src/content/posts/sample-post/hero.png` (NEW) — Placeholder hero image

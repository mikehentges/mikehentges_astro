# Story 3.3: Blog Listing Page

Status: done

## Story

As a visitor,
I want to browse all blog posts sorted by date,
so that I can find topics relevant to my interests.

## Acceptance Criteria

1. **Given** the blog listing page at `/blog`
   **When** it renders
   **Then** all published posts are displayed as BlogCards, sorted newest first
   **And** the page has a clear heading (h1)

2. **Given** multiple blog posts exist
   **When** viewing the listing
   **Then** the BlogCard grid follows the responsive layout: 3 columns desktop, 2 tablet, 1 mobile
   **And** each card links to the correct `/blog/[slug]` URL

3. **Given** the homepage Recent Writing section (Epic 2)
   **When** posts exist in the content collection
   **Then** the RecentWriting component receives real posts from the collection
   **And** the "View all" link correctly navigates to `/blog`

## Tasks / Subtasks

- [x] Task 1: Replace blog/index.astro with content collection listing (AC: #1, #2)
  - [x] Import and query `getCollection('posts')` from `astro:content`
  - [x] Sort posts by date descending (newest first)
  - [x] Map posts to BlogCard props: `href=/blog/{id}`, `date` (formatted), `datetime` (ISO), `title`, `summary`
  - [x] Add page heading (h1)
  - [x] Use responsive grid: 1-col mobile, 2-col tablet (sm:), 3-col desktop (lg:)

- [x] Task 2: Wire homepage RecentWriting to content collection (AC: #3)
  - [x] In `src/pages/index.astro`, import `getCollection` from `astro:content`
  - [x] Query posts, sort by date descending, map to RecentWriting post shape
  - [x] Pass posts array to `<RecentWriting posts={recentPosts} />`
  - [x] Wrap RecentWriting in scroll-reveal div (matching existing pattern)

- [x] Task 3: Verify build and rendering (AC: #1-3)
  - [x] Run `pnpm build` — must pass with zero errors
  - [x] Verify `/blog` page lists all posts
  - [x] Verify homepage shows recent posts in RecentWriting section

## Dev Notes

### BlogCard Props Shape

BlogCard expects: `{ href, date, datetime, title, summary }` (all strings).

Transform from content collection:
```typescript
const posts = (await getCollection("posts")).sort(
  (a, b) => b.data.date.getTime() - a.data.date.getTime()
);

const cardPosts = posts.map((post) => ({
  href: `/blog/${post.id}`,
  date: post.data.date.toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  }),
  datetime: post.data.date.toISOString().split("T")[0],
  title: post.data.title,
  summary: post.data.summary,
}));
```

### RecentWriting Props Shape

Same as BlogCard: `Post[] = { href, date, datetime, title, summary }`. Component slices to first 3 and shows "View all" if > 3.

### Homepage index.astro Current State

- RecentWriting is rendered with no props: `<RecentWriting />`
- Comment says: "RecentWriting self-hides when no posts exist; scroll-reveal added when content collection is wired"
- Need to add scroll-reveal wrapper and pass real posts

### Files to Modify

| File | Action | Notes |
|------|--------|-------|
| `src/pages/blog/index.astro` | REPLACE | Replace placeholder with collection-based listing |
| `src/pages/index.astro` | MODIFY | Wire RecentWriting to content collection |

### Anti-Patterns to Avoid

- Do NOT create a separate data fetching utility — inline the query in each page
- Do NOT modify BlogCard or RecentWriting components — they already work correctly
- Do NOT add pagination — flat list per spec

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 3.3]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#BlogCard]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (1M context)

### Debug Log References

- Build: 5 pages, 904ms, 0 errors
- Blog listing confirmed: sample post appears with correct link
- Homepage RecentWriting confirmed: "Recent Writing" section with sample post card

### Completion Notes List

- Replaced blog/index.astro placeholder with content collection-based listing (getCollection, sort, BlogCard grid)
- Wired homepage RecentWriting to content collection with scroll-reveal wrapper
- Date formatting consistent with blog post page (en-US, long month)
- No new components or dependencies — reuses existing BlogCard and RecentWriting

### File List

- `src/pages/blog/index.astro` (MODIFIED) — Content collection listing replacing placeholder
- `src/pages/index.astro` (MODIFIED) — Wired RecentWriting to content collection with scroll-reveal

# Story 3.2: Blog Post Page with AuthorBio

Status: done

## Story

As a visitor reading a blog post,
I want a clean, focused reading experience that ends with information about the author,
so that I can assess the writing quality and discover that consulting is available.

## Acceptance Criteria

1. **Given** a published blog post
   **When** visiting `/blog/[slug]`
   **Then** the page displays the post title (Sora Bold, h1) + date and reading time (JetBrains Mono) + prose content + AuthorBio
   **And** content width is constrained to 680px max
   **And** the page is wrapped in an `<article>` landmark

2. **Given** the prose content
   **When** rendered
   **Then** body text uses Satoshi at 1.125rem with 1.7 line-height
   **And** code blocks use JetBrains Mono on code-bg background
   **And** Tailwind typography styles are applied with custom overrides matching the design system
   **And** inline links within prose are amber with underline on hover

3. **Given** the reading time
   **When** calculated
   **Then** it is derived at build time from content length (words / ~200 wpm)

4. **Given** the AuthorBio component renders below the post content
   **When** displayed
   **Then** it shows name, title, 2-3 sentence bio, and links (About, Contact, LinkedIn)
   **And** it uses `<aside aria-label="About the author">`
   **And** the LinkedIn link satisfies FR11 for blog posts
   **And** it feels like a natural "about the author" block, not an advertisement

5. **Given** the content collection from Story 3.1 has posts
   **When** the site builds
   **Then** `getStaticPaths()` generates a route for every post in the collection
   **And** each post renders at `/blog/[slug]` with the correct content

6. **Given** the hero image in frontmatter
   **When** the post page renders
   **Then** the hero image is displayed using Astro's `<Image>` component (optimized, lazy-loaded)

## Tasks / Subtasks

- [x] Task 1: Install and configure Tailwind Typography plugin (AC: #2)
  - [x] Install `@tailwindcss/typography` via pnpm
  - [x] Add `@plugin "@tailwindcss/typography";` to `src/styles/global.css`
  - [x] Add custom prose overrides in global.css to match design system (colors, fonts, code blocks)
  - [x] Verify build passes with typography plugin

- [x] Task 2: Create AuthorBio component (AC: #4)
  - [x] Create `src/components/AuthorBio.astro`
  - [x] Use `<aside aria-label="About the author">` as wrapper
  - [x] Display: name (Mike Hentges), title, 2-3 sentence bio
  - [x] Include links: About page (`/about`), Contact page (`/contact`), LinkedIn profile
  - [x] Style with Tailwind utilities matching design system — natural reading flow, not ad-like
  - [x] Add top border separator (border color token) for visual separation from post content

- [x] Task 3: Replace blog/[slug].astro with real post page (AC: #1, #2, #3, #5, #6)
  - [x] Wire `getStaticPaths()` to `getCollection('posts')`
  - [x] Use `render()` from `astro:content` to get rendered post content
  - [x] Calculate reading time: `Math.ceil(body.split(/\s+/).length / 200)` using raw body text
  - [x] Render hero image with Astro `<Image>` component (import from `astro:assets`)
  - [x] Render title as h1 (Sora Bold)
  - [x] Render date + reading time in JetBrains Mono (secondary color)
  - [x] Render post content inside `.prose-width` container with `prose` class
  - [x] Add AuthorBio below post content
  - [x] Wrap content section in `<article>` landmark
  - [x] Ensure page title uses post title: `{title} | Hentges.AI`

- [x] Task 4: Verify build and rendering (AC: #1-6)
  - [x] Run `pnpm build` — must pass with zero errors
  - [x] Verify sample post renders at `/blog/sample-post`
  - [x] Verify hero image is optimized in build output (hero.png → .webp, 3kB → 1kB)
  - [x] Verify prose styling applies (headings, paragraphs, lists, code blocks, links)
  - [x] Verify AuthorBio appears below content with aside landmark

## Dev Notes

### Astro Content Collection Rendering (Astro 6)

In Astro 6 with the Content Layer API, rendering posts works differently from Astro 4/5:

```typescript
import { getCollection, render } from "astro:content";

export async function getStaticPaths() {
  const posts = await getCollection("posts");
  return posts.map((post) => ({
    params: { slug: post.id },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await render(post);
```

Key differences from legacy API:
- `render()` is imported from `astro:content` (not `post.render()`)
- `post.id` is the post identifier (directory name, e.g., "sample-post")
- `post.data` contains the validated frontmatter (title, date, summary, hero)
- `post.body` contains the raw markdown string (use for reading time calculation)
- `<Content />` is the rendered component to use in the template

### Reading Time Calculation

Calculate at build time from the raw body text:
```typescript
const words = post.body?.split(/\s+/).length ?? 0;
const readingTime = Math.max(1, Math.ceil(words / 200));
```

### Hero Image with Astro Image Component

The `hero` field from the schema is an `ImageMetadata` object (resolved by Astro's `image()` schema helper). Render with:
```astro
import { Image } from "astro:assets";

<Image
  src={post.data.hero}
  alt={`Hero image for ${post.data.title}`}
  width={1200}
  height={630}
  class="..."
/>
```

### Tailwind Typography Plugin (v4)

For Tailwind CSS v4, the typography plugin is added via CSS import, not a config file:

```css
/* In global.css, after @import "tailwindcss" */
@plugin "@tailwindcss/typography";
```

Then use the `prose` class on the content wrapper. Custom overrides for the dark theme:

```css
.prose {
  --tw-prose-body: var(--color-text-primary);
  --tw-prose-headings: var(--color-text-primary);
  --tw-prose-links: var(--color-accent);
  --tw-prose-bold: var(--color-text-primary);
  --tw-prose-code: var(--color-text-primary);
  --tw-prose-pre-bg: var(--color-code-bg);
  --tw-prose-pre-code: var(--color-text-primary);
  --tw-prose-quotes: var(--color-text-secondary);
  --tw-prose-quote-borders: var(--color-accent);
  --tw-prose-counters: var(--color-text-secondary);
  --tw-prose-bullets: var(--color-text-secondary);
  --tw-prose-hr: var(--color-border);
  --tw-prose-th-borders: var(--color-border);
  --tw-prose-td-borders: var(--color-border);
}
```

### Existing CSS Context

`global.css` already defines:
- `.prose-width` — `max-width: 680px; margin-inline: auto;`
- `.prose-content a:not([class])` — amber links with hover underline (these work with the typography plugin)
- Code/pre font styles — JetBrains Mono at 0.9375rem
- Heading styles — h1 (Sora, 2.5rem), h2 (1.75rem), h3 (1.25rem)

The typography plugin `prose` class will layer on paragraph spacing, list formatting, and blockquote styles. The custom CSS variable overrides make it match the dark theme.

### AuthorBio Design

Per UX spec (UX-DR8):
- Name + title + 2-3 sentence bio + links (About, Contact, LinkedIn)
- `<aside aria-label="About the author">`
- Natural reading flow — "about the author" block, NOT an ad
- Placed directly after post `<Content />`, inside the `<article>`

Bio content: Mike Hentges is a technology leader with 20+ years building and leading enterprise systems. He advises organizations on making AI work in production — not as a shortcut, but as an accelerator for teams that already know how to build. Links should be inline text links (amber, hover underline), not buttons.

### Previous Story 3.1 Intelligence

- Content config at `src/content.config.ts` — schema: title, date, summary, hero (image)
- Sample post at `src/content/posts/sample-post/index.md` with `hero.png`
- Build passes clean with the collection
- `z` deprecation hints from `astro:content` are cosmetic — ignore them

### Files to Create/Modify

| File | Action | Notes |
|------|--------|-------|
| `src/components/AuthorBio.astro` | CREATE | New component |
| `src/pages/blog/[slug].astro` | REPLACE | Replace placeholder with real post page |
| `src/styles/global.css` | MODIFY | Add typography plugin import + prose overrides |
| `package.json` | MODIFY | Add @tailwindcss/typography dependency (via pnpm add) |

### Anti-Patterns to Avoid

- Do NOT use `post.render()` — that's Astro 4/5 legacy. Use `render(post)` from `astro:content`.
- Do NOT use raw `<img>` tags — always Astro `<Image>` component
- Do NOT hardcode hex colors — use Tailwind theme tokens
- Do NOT use `@apply` — Tailwind utility classes only in templates
- Do NOT make AuthorBio look like an ad/CTA — it should feel editorial
- Do NOT add a `BlogPostLayout.astro` wrapper — use BaseLayout directly with the content inlined in `[slug].astro`

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 3.2]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#BlogPostLayout]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#AuthorBio]
- [Source: _bmad-output/planning-artifacts/architecture.md#Content Collection Schema]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (1M context)

### Debug Log References

- Sharp was not installed — added as dependency for image optimization
- Hero image optimization confirmed: hero.png (3kB) → .webp (1kB)
- Typography plugin CSS variable overrides applied for dark theme colors
- Build: 5 pages, 1.24s, 0 errors

### Completion Notes List

- Installed `@tailwindcss/typography` and added prose overrides for dark theme in global.css
- Created `AuthorBio.astro` with aside landmark, name/title/bio/links (About, Contact, LinkedIn)
- Replaced `blog/[slug].astro` placeholder with content collection-based post page
- Uses Astro 6 `render()` from `astro:content`, `getCollection('posts')` for static paths
- Reading time calculated from word count (~200 wpm)
- Hero rendered via Astro `<Image>` component with WebP optimization
- Added `sharp` as dependency (required for Astro image optimization at build time)

### File List

- `src/components/AuthorBio.astro` (NEW) — Author bio aside component
- `src/pages/blog/[slug].astro` (MODIFIED) — Full blog post page replacing placeholder
- `src/styles/global.css` (MODIFIED) — Typography plugin + prose dark theme overrides
- `package.json` (MODIFIED) — Added @tailwindcss/typography and sharp dependencies
- `pnpm-lock.yaml` (MODIFIED) — Lock file updated

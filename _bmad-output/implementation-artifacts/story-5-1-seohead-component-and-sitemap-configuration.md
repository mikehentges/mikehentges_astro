# Story 5.1: SEOHead Component & Sitemap Configuration

Status: done

## Story

As a site owner,
I want every page to have proper SEO metadata, structured data, and a working sitemap,
so that the site is discoverable via search engines and shareable on social media with rich previews.

## Acceptance Criteria

1. **Given** the shared SEOHead component, **when** used by any page layout, **then** it renders `<title>` and `<meta name="description">` with page-specific values, Open Graph tags (`og:title`, `og:description`, `og:image`, `og:url`, `og:type`), Twitter Card tags (`twitter:card` as summary_large_image, `twitter:title`, `twitter:description`, `twitter:image`), and a canonical URL `<link rel="canonical">` for each page.

2. **Given** the homepage, **when** SEOHead renders, **then** JSON-LD structured data includes `WebSite` and `Person` schema types.

3. **Given** a blog post page, **when** SEOHead renders, **then** JSON-LD structured data includes `BlogPosting` schema with title, date, author, and description.

4. **Given** the About page, **when** SEOHead renders, **then** JSON-LD structured data includes `Person` schema with professional details.

5. **Given** the `@astrojs/sitemap` integration, **when** the site builds, **then** a valid `sitemap.xml` is generated at the root containing all five routes and all blog post URLs, with the production site URL correctly configured.

6. **Given** the SEOHead component integrated into BaseLayout, **then** every page on the site receives SEO metadata with no manual per-page wiring required beyond passing props.

## Tasks / Subtasks

- [x] Task 1: Create SEOHead component (AC: 1)
  - [x] 1.1 Create `src/components/SEOHead.astro` with Props interface accepting: `title` (string), `description` (string), `ogImage` (string, optional), `ogType` (string, default "website"), `canonicalUrl` (string, optional), `jsonLd` (object, optional)
  - [x] 1.2 Render `<title>` from props (append " | Hentges.AI" suffix pattern, or accept full title)
  - [x] 1.3 Render `<meta name="description">` from description prop
  - [x] 1.4 Render Open Graph tags: `og:title`, `og:description`, `og:image`, `og:url`, `og:type`
  - [x] 1.5 Render Twitter Card tags: `twitter:card` (summary_large_image), `twitter:title`, `twitter:description`, `twitter:image`
  - [x] 1.6 Render `<link rel="canonical">` using `Astro.url` or canonicalUrl prop
  - [x] 1.7 Render JSON-LD `<script type="application/ld+json">` block from jsonLd prop

- [x] Task 2: Integrate SEOHead into BaseLayout (AC: 6)
  - [x] 2.1 Update BaseLayout.astro Props interface to accept SEO props: `description`, `ogImage`, `ogType`, `jsonLd`
  - [x] 2.2 Import and render SEOHead in the `<head>` section, replacing the current bare `<title>` tag
  - [x] 2.3 Set sensible defaults: description = "Mike Hentges — AI practitioner, enterprise systems builder, and manufacturing operations leader helping organizations build the right thing, the right way.", ogImage = a default social card image path

- [x] Task 3: Wire SEO props on all pages (AC: 1, 2, 3, 4)
  - [x] 3.1 Homepage (`src/pages/index.astro`): Pass description, ogType="website", jsonLd with `WebSite` + `Person` schema
  - [x] 3.2 Blog listing (`src/pages/blog/index.astro`): Pass description for blog page
  - [x] 3.3 Blog post (`src/pages/blog/[slug].astro`): Pass post title, summary as description, ogType="article", jsonLd with `BlogPosting` schema including title, datePublished, author, description
  - [x] 3.4 About page (`src/pages/about.astro`): Pass description, jsonLd with `Person` schema including professional details
  - [x] 3.5 Contact page (`src/pages/contact.astro`): Pass description

- [x] Task 4: Verify sitemap configuration (AC: 5)
  - [x] 4.1 Confirm `@astrojs/sitemap` integration is active in `astro.config.ts` and `site: 'https://hentges.ai'` is set (already done — just verify)
  - [x] 4.2 Build and confirm sitemap-index.xml and sitemap-0.xml are generated in dist/ with all routes
  - [x] 4.3 Confirm `public/robots.txt` references the sitemap URL correctly (already done — verify)

- [x] Task 5: Build verification (AC: all)
  - [x] 5.1 Run `pnpm build` — zero errors
  - [x] 5.2 Verify HTML output of each page contains proper meta tags, OG tags, Twitter Card tags, canonical URL, and JSON-LD

## Dev Notes

### Current State (What Already Exists)

- **BaseLayout.astro** at `src/layouts/BaseLayout.astro` — currently has minimal `<head>`: charset, viewport, favicon, and bare `<title>` tag. Props interface: `{ title?: string; transparent?: boolean }`.
- **Sitemap**: `@astrojs/sitemap` is already installed, configured in `astro.config.ts` with `site: 'https://hentges.ai'`. Build already generates `dist/sitemap-index.xml` and `dist/sitemap-0.xml` with all routes.
- **robots.txt**: Already exists at `public/robots.txt` with `Sitemap: https://hentges.ai/sitemap-index.xml`.
- **Title pattern**: Pages already pass titles like `"Home | Hentges.AI"`, `"About | Hentges.AI"`, `"${post.data.title} | Hentges.AI"`.

### Component Pattern to Follow

All existing components use this Astro pattern:
```astro
---
interface Props {
  propName: type;
}
const { propName = defaultValue } = Astro.props;
---
<markup />
```

Place the new file at `src/components/SEOHead.astro` — flat directory, no subdirectories.

### Architecture Requirements

- **Single shared SEOHead component** used by all page layouts [Source: architecture.md#SEO Metadata]
- Rationale: "Consistency across all five routes. Hard to forget a tag."
- SEOHead is rendered inside `<head>` in BaseLayout — individual pages pass SEO data as props to BaseLayout which forwards to SEOHead
- Use `Astro.url` for canonical URLs (provides full URL including path)

### JSON-LD Schema Types by Page

| Page | JSON-LD Types | Key Properties |
|------|--------------|----------------|
| Homepage | `WebSite` + `Person` | name, url, description; name, jobTitle, url, sameAs |
| Blog post | `BlogPosting` | headline, datePublished, author (Person), description, image |
| About | `Person` | name, jobTitle, description, url, sameAs (LinkedIn) |
| Blog listing | None required | (meta tags sufficient) |
| Contact | None required | (meta tags sufficient) |

### Content Schema Available for Blog Posts

From `src/content.config.ts`, blog posts have: `title` (string), `date` (date), `summary` (string), `hero` (image). The `summary` field maps directly to `description` for meta/OG tags. The `date` maps to `datePublished` in BlogPosting JSON-LD.

### Default Social Card Image

Create or designate a default OG image for non-blog pages. Options:
- Use an existing asset or create a simple branded card at `public/og-default.jpg` (1200x630px recommended for OG)
- Blog posts can use their `hero` image as the OG image

### Deferred Work Items Addressed by This Story

- "No `<meta name="description">` or Open Graph tags on the About page" — resolved by integrating SEOHead into BaseLayout
- This story does NOT address CSP/Permissions-Policy headers (separate concern, deferred)

### Do NOT

- Do not modify the sitemap integration — it already works correctly
- Do not add any client-side JavaScript — SEOHead is entirely server-rendered in `<head>`
- Do not use raw hex colors — use Tailwind theme tokens if any styling needed
- Do not create subdirectories in `src/components/`
- Do not add a `draft` field or modify the content schema
- Do not add `@apply` — no styling needed in SEOHead (it's all `<meta>` tags)

### Project Structure Notes

- All components in flat `src/components/` directory
- Layouts in `src/layouts/`
- Pages in `src/pages/` with blog subdir
- Config at `astro.config.ts` (TypeScript, not .mjs)
- Content config at `src/content.config.ts`

### References

- [Source: _bmad-output/planning-artifacts/architecture.md#SEO Metadata]
- [Source: _bmad-output/planning-artifacts/epics.md#Story 5.1]
- [Source: _bmad-output/planning-artifacts/prd.md#Scope - What to Build]
- [Source: _bmad-output/implementation-artifacts/deferred-work.md#Epic 4 deferred items]

### Review Findings

- [x] [Review][Patch] Missing `public/og-default.jpg` — removed broken default; og:image/twitter:image only render when ogImage is provided [src/components/SEOHead.astro:12]
- [x] [Review][Patch] Blog posts don't pass hero image as `ogImage` — now passes `post.data.hero.src` for social previews [src/pages/blog/[slug].astro:29]
- [x] [Review][Patch] JSON-LD XSS via `set:html` — `<` now escaped as `\u003c` in JSON-LD output [src/components/SEOHead.astro:27]
- [x] [Review][Patch] Single JSON-LD objects wrapped in arrays — removed array coercion; single objects render as plain JSON [src/components/SEOHead.astro:27]
- [x] [Review][Defer] `ogImage` path handling assumes leading slash for relative paths — no current callers affected [src/components/SEOHead.astro:24]
- [x] [Review][Defer] `canonicalUrl` prop not forwarded through BaseLayout — no current need for canonical overrides [src/layouts/BaseLayout.astro]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (1M context)

### Debug Log References

- Astro hint about `is:inline` on script with `type` attribute — resolved by adding `is:inline` directive to JSON-LD script tag

### Completion Notes List

- Created SEOHead.astro component with full meta, OG, Twitter Card, canonical, and JSON-LD support
- Integrated SEOHead into BaseLayout replacing bare `<title>` tag, with sensible defaults
- Wired page-specific SEO props on all 5 page types (home, blog listing, blog post, about, contact)
- Homepage has WebSite + Person JSON-LD; blog posts have BlogPosting JSON-LD; about has Person JSON-LD
- Verified sitemap generation (already configured from Epic 1), robots.txt correct
- Build passes with 0 errors, HTML output verified for all pages

### File List

- src/components/SEOHead.astro (new)
- src/layouts/BaseLayout.astro (modified)
- src/pages/index.astro (modified)
- src/pages/blog/index.astro (modified)
- src/pages/blog/[slug].astro (modified)
- src/pages/about.astro (modified)
- src/pages/contact.astro (modified)

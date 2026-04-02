---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
lastStep: 8
status: 'complete'
completedAt: '2026-04-02'
inputDocuments:
  - product-brief-mikehentges_astro-distillate.md
  - prd.md
  - ux-design-specification.md
workflowType: 'architecture'
project_name: 'mikehentges_astro'
user_name: 'Mike'
date: '2026-04-02'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**
Five-route static site (/, /blog, /blog/[slug], /about, /contact). Markdown content collections with Zod schema. Homepage with narrative scroll sections and animated reveals. Author bio block on every blog post. Direct email + LinkedIn CTAs. Content migration from existing posts (retire hobby content).

**Non-Functional Requirements:**
- Lighthouse Performance >95, homepage <500KB
- WCAG 2.1 AA accessibility
- SEO: meta tags, Open Graph, JSON-LD, sitemap, canonical URLs
- Build time <60s, new post → live <30min
- Self-hosted fonts (no external CDN requests)
- Modern evergreen browsers only

**Scale & Complexity:**
- Primary domain: Static web / content site
- Complexity level: Low
- Architectural components: ~10 Astro components, 5 page routes, 1 content collection, 1 layout

### Technical Constraints & Dependencies

- Astro (latest) — static output only, no SSR
- Tailwind CSS v4 + Tailwind Plus (component patterns)
- Cloudflare Pages deployment (auto-deploy on push to main)
- Astro built-in image optimization (`astro:assets` / Sharp) for all images — Cloudinary removed
- Self-hosted fonts: Sora, Satoshi, JetBrains Mono

### Cross-Cutting Concerns

- **SEO metadata** — every route needs proper meta, OG tags, and JSON-LD
- **Accessibility** — semantic landmarks, heading hierarchy, focus management, contrast ratios, skip link
- **Font loading strategy** — three self-hosted font families need a performant loading approach to hit Lighthouse targets
- **Design token consistency** — color system and type scale must be centralized for component reuse

## Starter Template

### Selected: Astro 6 (create-astro)

**Initialization:**
```bash
npm create astro@latest -- --template minimal
npx astro add tailwind cloudflare sitemap
```

**What the starter provides:**
- Astro 6.1.x with Vite build pipeline
- Static output mode (switchable to hybrid if needed)
- TypeScript support
- Dev server with HMR

**What we add immediately after init:**
- `@tailwindcss/vite` plugin (via `astro add tailwind`)
- `@astrojs/cloudflare` adapter (via `astro add cloudflare`)
- `@astrojs/sitemap` integration (via `astro add sitemap`)
- Astro Fonts API config for Sora, Satoshi, JetBrains Mono
- Content collection schema (`src/content/config.ts`)

**Architectural decisions made by starter:**
- Vite as build tool (no choice needed)
- File-based routing in `src/pages/`
- Component-based architecture (`.astro` files)
- Static-first output

**Runtime requirement:** Node 22+

## Core Architectural Decisions

### Image Strategy
**Decision:** Remove Cloudinary dependency. Use Astro's built-in image optimization (`astro:assets` / Sharp) for all images. Hero images stored locally in the content folder, optimized at build time (resizing, WebP/AVIF, lazy loading).
**Rationale:** Simplify — no external dependency, fewer moving parts, better Lighthouse scores with modern formats.

### SEO Metadata
**Decision:** Single shared `<SEOHead>` component used by all page layouts. Accepts props for title, description, OG image, JSON-LD type. Every route calls it.
**Rationale:** Consistency across all five routes. Hard to forget a tag.

### Design Tokens
**Decision:** All UX spec color, typography, and spacing values encoded in Tailwind v4 theme config (`@theme`) as the single source of truth. Components reference tokens via Tailwind utilities only.
**Rationale:** One place to change design values. No competing CSS variables.

### Content Collection Schema
**Decision:** Minimal schema — `title` (string, required), `date` (date, required), `summary` (string, required), `hero` (image, required). Reading time calculated at build time from content length.
**Dropped:** `categories` (not exposed in UI), `attrib` (not used).
**Rationale:** Only store what the site actually renders or needs for cross-posting.

### Deferred Decisions
- Categories filtering UI — frontmatter field removed; re-add if needed later
- Newsletter integration — out of scope per PRD
- Productized offering pages — out of scope per PRD

## Implementation Patterns & Consistency Rules

### Naming Patterns
- **Components:** PascalCase (`StickyNav.astro`, `BlogCard.astro`)
- **Pages:** kebab-case per Astro convention (`src/pages/blog/[slug].astro`)
- **CSS/config files:** kebab-case (`global.css`, `tailwind.config.ts`)

### Structure Patterns
- **Components:** Flat `src/components/` directory — no subdirectories at this scale
- **Content:** Co-located posts with assets (`src/content/posts/my-post/index.md` + `hero.jpg`)
- **Layouts:** `src/layouts/` for BaseLayout and any page-level wrappers

### Styling Patterns
- **No `@apply`** — all styling as Tailwind utility classes in component templates
- **Component encapsulation** provides reuse — `.astro` files are the abstraction boundary
- **Design tokens** referenced only through Tailwind theme utilities, never raw hex values

### Code Standards
- **TypeScript:** Strict mode enabled
- **Formatting:** Prettier, tabWidth: 2
- **Images:** Always use Astro `<Image>` component for optimization, never raw `<img>` tags

### Anti-Patterns to Avoid
- Creating utility/helper files for one-time operations
- Adding `@apply` extraction for "reusable" class groups
- Using raw color values instead of Tailwind theme tokens
- Placing images in `public/` (bypasses optimization pipeline)

## Project Structure

```
mikehentges_astro/
├── astro.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── .prettierrc
├── public/
│   ├── robots.txt
│   └── favicon.svg
├── src/
│   ├── content/
│   │   ├── config.ts              # Zod schema: title, date, summary, hero
│   │   └── posts/
│   │       └── my-post/
│   │           ├── index.md
│   │           └── hero.jpg
│   ├── layouts/
│   │   └── BaseLayout.astro       # HTML shell, global CSS, StickyNav + Footer
│   ├── components/
│   │   ├── StickyNav.astro        # Wordmark + nav links, sticky with scroll behavior
│   │   ├── Footer.astro           # Wordmark + copyright
│   │   ├── SEOHead.astro          # Meta, OG, JSON-LD — used by all pages
│   │   ├── HeroChapter.astro      # Full-viewport hero with animated reveals
│   │   ├── POVSection.astro       # Brand thesis blockquote section
│   │   ├── PillarGrid.astro       # 3-column value pillars
│   │   ├── ChapterLabel.astro     # Monospace section markers
│   │   ├── BlogCard.astro         # Date + title + summary card
│   │   ├── AuthorBio.astro        # Post-article author block with CTAs
│   │   └── CTASection.astro       # Closing CTA with email link
│   ├── pages/
│   │   ├── index.astro            # Home: Hero → POV → Pillars → Recent → CTA
│   │   ├── about.astro            # Career narrative + CTA
│   │   ├── contact.astro          # Email + LinkedIn + framing
│   │   └── blog/
│   │       ├── index.astro        # All posts, date-sorted
│   │       └── [slug].astro       # Post layout: title + meta + prose + AuthorBio
│   └── styles/
│       └── global.css             # @import "tailwindcss", font imports, prose overrides
└── dist/                          # Build output (Cloudflare Pages serves this)
```

### Route → Component Mapping

| Route | Layout | Components Used |
|-------|--------|----------------|
| `/` | BaseLayout | HeroChapter, POVSection, PillarGrid, ChapterLabel, BlogCard, CTASection |
| `/blog` | BaseLayout | BlogCard |
| `/blog/[slug]` | BaseLayout | AuthorBio |
| `/about` | BaseLayout | CTASection |
| `/contact` | BaseLayout | — |
| _all pages_ | BaseLayout | StickyNav, Footer, SEOHead |

### Data Flow

Content authors add `src/content/posts/new-post/index.md` + `hero.jpg` → git push → Cloudflare Pages builds → Astro reads content collection → generates static HTML with optimized images → serves via CDN.

## Architecture Validation

### Gap Found & Resolved
- **Sitemap:** Added `@astrojs/sitemap` integration to init command and integrations list.

### Completeness Checklist

- [x] All 5 routes have page files and component mappings
- [x] All 10 UX spec components mapped to `.astro` files
- [x] Content schema defined (title, date, summary, hero)
- [x] SEO strategy: shared `<SEOHead>` + sitemap integration
- [x] Image strategy: local + Astro optimization, no external CDN
- [x] Font strategy: Astro 6 Fonts API, self-hosted
- [x] Design tokens: Tailwind v4 `@theme` as single source
- [x] Deployment: Cloudflare Pages auto-deploy
- [x] Patterns: naming, structure, styling, anti-patterns documented
- [x] No database, API, auth, or state management needed

### Readiness Assessment

**Status:** Ready for implementation
**Confidence:** High — low-complexity static site with well-defined structure and few moving parts.

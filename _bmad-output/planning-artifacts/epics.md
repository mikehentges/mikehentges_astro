---
stepsCompleted: [1, 2, 3, 4]
inputDocuments:
  - prd.md
  - architecture.md
  - ux-design-specification.md
---

# mikehentges_astro - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for mikehentges_astro, decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

FR1: Implement five-route static site architecture: Home (/), Blog (/blog), Blog Post (/blog/[slug]), About (/about), Contact (/contact)
FR2: Build Homepage with narrative scroll flow: empowerment-led hero → POV block → value pillars → recent posts → CTA
FR3: Build About page with three career threads (enterprise systems builder, manufacturing operations leader, AI practitioner) woven into cohesive narrative, CTA at bottom
FR4: Build Contact page with direct email (mailto:mike@hentges.ai) and LinkedIn link — no form
FR5: Build Blog listing page showing all posts date-sorted (newest first)
FR6: Build Blog Post pages with clean reading experience and AuthorBio block after every post
FR7: Implement content collection with Markdown files and Zod-validated frontmatter schema (title, date, summary, hero)
FR8: Migrate existing tech/AI posts from current site — frontmatter updates to match new schema, content body as-is
FR9: Retire all chess, woodworking, and hobby content entirely
FR10: Implement SEO across all routes: meta tags, Open Graph/Twitter Card, JSON-LD structured data, sitemap, canonical URLs
FR11: Include LinkedIn follow CTA on blog posts and contact page
FR12: Build mobile-responsive layout across all breakpoints
FR13: Deploy to Cloudflare Pages with auto-deploy on push to main and preview builds
FR14: Write 1-2 new blog posts reinforcing brand themes at launch

### NonFunctional Requirements

NFR1: Lighthouse Performance score >95
NFR2: New post → live on production in <30 minutes (Markdown file + git push)
NFR3: Homepage page weight <500KB including all assets
NFR4: Build time <60 seconds
NFR5: WCAG 2.1 AA accessibility compliance
NFR6: Modern evergreen browsers only (Chrome, Firefox, Safari, Edge — latest 2 versions)
NFR7: Site must look and feel finished at launch — a half-designed credibility platform undermines its entire purpose

### Additional Requirements

- Starter template: Astro 6 via `npm create astro@latest -- --template minimal`, then add Tailwind, Cloudflare adapter, and sitemap integration
- Node 22+ runtime requirement
- Image strategy: Remove Cloudinary dependency entirely; use Astro built-in image optimization (astro:assets / Sharp) with locally co-located hero images
- Self-hosted fonts via Astro Fonts API: Sora, Satoshi, JetBrains Mono — no external CDN requests
- Design tokens encoded in Tailwind v4 `@theme` config as single source of truth
- Content collection schema: `title` (string), `date` (date), `summary` (string), `hero` (image) — categories dropped from schema, `attrib` removed
- Shared `<SEOHead>` component used by all page layouts
- No `@apply` — all styling as Tailwind utility classes in component templates
- TypeScript strict mode enabled
- Prettier formatting, tabWidth: 2
- Components in flat `src/components/` directory (no subdirectories)
- Posts co-located with assets: `src/content/posts/my-post/index.md` + `hero.jpg`
- Never use raw `<img>` tags — always Astro `<Image>` component
- Never use raw hex color values — always Tailwind theme tokens

### UX Design Requirements

UX-DR1: Implement color system with 8 design tokens — background (#111113), surface (#1a1a1f), text-primary (#e8e4de), text-secondary (#9a958e), accent (#d4a053), accent-hover (#e4b563), border (#252528), code-bg (#0d0d0f) — all via Tailwind v4 @theme
UX-DR2: Implement typography system with 3 self-hosted fonts (Sora for display/headings, Satoshi for body, JetBrains Mono for code/dates/labels) and 7-level type scale with specified sizes, weights, and line heights
UX-DR3: Build StickyNav component — wordmark "Hentges.ai" with amber on ".ai", nav links right (Blog, About, Contact), transparent-to-solid on homepage scroll (backdrop blur), always solid background on other pages, `aria-current="page"` on active link
UX-DR4: Build HeroChapter component — full-viewport (90vh desktop, 80vh mobile) hero with fluid-clamp headline, staggered load animation (headline 0.8s → subtitle 0.3s delay → scroll hint 0.8s delay), all behind `prefers-reduced-motion`
UX-DR5: Build POVSection component — chapter label above blockquote with 2px left amber border, Sora Medium ~2rem text, surface-color background full-width with constrained content
UX-DR6: Build PillarGrid component — 3 value pillars in CSS grid (3-col desktop, 1-col mobile), heading (Sora Semibold) + description (Satoshi, secondary), 1px gap-based grid borders
UX-DR7: Build BlogCard component — date (monospace, amber) + title (Sora Semibold) + summary (Satoshi, secondary), entire card as single `<a>`, hover: amber border + translateY(-3px), grid layout (3-col desktop, 2-col tablet, 1-col mobile)
UX-DR8: Build AuthorBio component — name + title + 2-3 sentence bio + links (About, Contact, LinkedIn), `<aside aria-label="About the author">`, natural reading flow not ad-like
UX-DR9: Build ChapterLabel component — small monospace text markers in amber with slight opacity, used above homepage sections for narrative pacing
UX-DR10: Build CTASection component — heading + subtitle + email link (amber, underlined), used on homepage and About page bottom
UX-DR11: Build Footer component — minimal wordmark + copyright, no link duplication from nav
UX-DR12: Implement link hierarchy with 4 distinct styles — primary CTA (solid amber bg, dark text, max 1 per viewport), text link + underline (amber, 2px border), inline link (amber, underline on hover), nav link (secondary → primary on hover, amber when active)
UX-DR13: Implement focus states — 2px amber outline on `:focus-visible` only, tab order follows visual order
UX-DR14: Implement homepage scroll-triggered section reveals via IntersectionObserver as progressive enhancement (content visible without JS), respecting `prefers-reduced-motion`
UX-DR15: Implement skip link as first focusable element on every page
UX-DR16: Implement semantic landmarks on every page: `<main>`, `<nav>`, `<article>`, `<aside>`, `<footer>` with proper heading hierarchy (never skip levels)
UX-DR17: Implement layout system — 1200px page max-width, 680px prose max-width (65-75 chars/line), single column, generous vertical rhythm, mobile with tighter spacing and reduced font sizes
UX-DR18: Implement BlogPostLayout — title (Sora Bold, h1) + date/reading time (monospace) + prose content (Tailwind typography plugin with custom overrides) + AuthorBio, 680px max content width, code blocks in JetBrains Mono on code-bg
UX-DR19: Implement hover states on every interactive element — 0.2s ease for color transitions, 0.3s ease for card transforms + borders, never exceed 0.4s

### FR Coverage Map

| FR | Epic | Description |
|----|------|-------------|
| FR1 | Epic 1 | Five-route architecture |
| FR2 | Epic 2 | Homepage narrative scroll flow |
| FR3 | Epic 4 | About page |
| FR4 | Epic 4 | Contact page |
| FR5 | Epic 3 | Blog listing page |
| FR6 | Epic 3 | Blog post pages with AuthorBio |
| FR7 | Epic 3 | Content collection with Zod schema |
| FR8 | Epic 3 | Migrate tech/AI posts |
| FR9 | Epic 3 | Retire hobby content |
| FR10 | Epic 5 | SEO (meta, OG, JSON-LD, sitemap, canonicals) |
| FR11 | Epic 3 | LinkedIn CTA on posts and contact |
| FR12 | Epic 1 | Mobile-responsive layout |
| FR13 | Epic 1 | Cloudflare Pages deployment |
| FR14 | Epic 5 | 1-2 new launch posts |

## Epic List

### Epic 1: Site Foundation & Navigation
Visitors can access a professionally designed site with working navigation across all five routes, consistent visual identity, responsive layout, accessibility foundations, and automated deployment to Cloudflare Pages.
**FRs covered:** FR1, FR12, FR13
**UX-DRs covered:** UX-DR1, UX-DR2, UX-DR3, UX-DR11, UX-DR12, UX-DR13, UX-DR15, UX-DR16, UX-DR17, UX-DR19

### Epic 2: Homepage Experience
Visitors land on a compelling, narrative-driven homepage that communicates Mike's value proposition through editorial scroll flow with animated reveals and a clear path to engagement.
**FRs covered:** FR2
**UX-DRs covered:** UX-DR4, UX-DR5, UX-DR6, UX-DR7, UX-DR9, UX-DR10, UX-DR14

### Epic 3: Blog & Content System
Visitors can browse all blog posts, read individual articles with a polished reading experience, and discover the author. Mike can publish new content via Markdown + git push. Existing tech/AI content is migrated and hobby content is retired.
**FRs covered:** FR5, FR6, FR7, FR8, FR9, FR11
**UX-DRs covered:** UX-DR7, UX-DR8, UX-DR18

### Epic 4: About & Contact Pages
Prospects can learn about Mike's career depth across three professional threads and easily reach out via direct email or LinkedIn.
**FRs covered:** FR3, FR4

### Epic 5: SEO & Launch Readiness
The site is discoverable via search engines, shareable on social media with rich previews, meets all performance targets, and launches with fresh content.
**FRs covered:** FR10, FR14

## Epic 1: Site Foundation & Navigation

Visitors can access a professionally designed site with working navigation across all five routes, consistent visual identity, responsive layout, accessibility foundations, and automated deployment to Cloudflare Pages.

### Story 1.1: Project Initialization & Toolchain

As a developer,
I want a fully configured Astro 6 project with all integrations and tooling in place,
So that all subsequent development has a consistent, working foundation.

**Acceptance Criteria:**

**Given** a fresh project directory
**When** the Astro 6 minimal template is initialized
**Then** the project builds and runs on `localhost:4321`
**And** `@tailwindcss/vite` plugin is installed and configured
**And** `@astrojs/cloudflare` adapter is installed and configured
**And** `@astrojs/sitemap` integration is installed and configured
**And** TypeScript strict mode is enabled in `tsconfig.json`
**And** Prettier is configured with tabWidth: 2
**And** Node 22+ is specified as the runtime requirement

**Given** the project is initialized
**When** examining the directory structure
**Then** `src/components/`, `src/layouts/`, `src/pages/`, `src/pages/blog/`, `src/content/posts/`, and `src/styles/` directories exist
**And** placeholder pages exist for all 5 routes: `/` (index.astro), `/blog` (blog/index.astro), `/blog/[slug]` (blog/[slug].astro), `/about` (about.astro), `/contact` (contact.astro)
**And** each placeholder page renders a basic heading identifying the route
**And** `pnpm dev` serves all 5 routes without errors

### Story 1.2: Design Tokens & Typography System

As a visitor,
I want the site to have a consistent, professional visual identity,
So that the design communicates credibility and intentionality.

**Acceptance Criteria:**

**Given** the Tailwind v4 `@theme` configuration
**When** design tokens are defined
**Then** all 8 color tokens are available: background (#111113), surface (#1a1a1f), text-primary (#e8e4de), text-secondary (#9a958e), accent (#d4a053), accent-hover (#e4b563), border (#252528), code-bg (#0d0d0f)
**And** no raw hex values are used in any component — only Tailwind theme tokens

**Given** the typography system is configured
**When** fonts are loaded
**Then** Sora, Satoshi, and JetBrains Mono are self-hosted via Astro Fonts API with no external CDN requests
**And** the 7-level type scale is implemented: hero heading (Sora, clamp 2.5-4rem, 700), page heading h1 (Sora, 2.5rem, 600), section heading h2 (Sora, 1.75rem, 600), sub-heading h3 (Satoshi, 1.25rem, 700), body (Satoshi, 1.125rem, 400, 1.7 line-height), small/meta (Satoshi, 0.875rem, 500), code (JetBrains Mono, 0.9375rem, 400)

**Given** the global.css file
**When** inspected
**Then** it imports Tailwind CSS, defines font-face declarations, and includes any prose override foundations

### Story 1.3: Base Layout & Accessibility Foundations

As a visitor (including those using assistive technology),
I want every page to have consistent structure, responsive layout, and accessibility foundations,
So that the site is usable and navigable regardless of device or ability.

**Acceptance Criteria:**

**Given** any page on the site
**When** rendered in a browser
**Then** BaseLayout.astro wraps the page with proper HTML shell (`<html lang="en">`, unique `<title>`)
**And** page content is constrained to 1200px max-width, centered
**And** prose content areas are constrained to 680px max-width (65-75 characters per line)
**And** the layout is single-column with generous vertical rhythm

**Given** a keyboard user navigating any page
**When** they press Tab as the first action
**Then** a skip link ("Skip to content") appears as the first focusable element
**And** activating it moves focus to the `<main>` content area

**Given** any page
**When** examined for landmarks
**Then** semantic HTML landmarks are present: `<main>`, `<nav>`, `<footer>`
**And** heading hierarchy never skips levels (h1 → h2 → h3)

**Given** any interactive element
**When** focused via keyboard (`:focus-visible`)
**Then** a 2px amber outline is visible
**And** tab order follows visual order

**Given** a mobile viewport (< 768px)
**When** any page is rendered
**Then** spacing is tighter, font sizes are reduced (hero 2.5rem, body 1rem)
**And** no horizontal scrolling occurs
**And** minimum touch targets are 44x44px

### Story 1.4: StickyNav Component

As a visitor,
I want a persistent navigation bar with clear site identity,
So that I always know where I am and can navigate to any section.

**Acceptance Criteria:**

**Given** any page on the site
**When** the StickyNav renders
**Then** it displays the wordmark "Hentges.ai" on the left with ".ai" in accent amber color
**And** nav links (Blog, About, Contact) are displayed on the right
**And** the nav uses `<nav>` landmark element
**And** the current page's nav link has `aria-current="page"`

**Given** the homepage
**When** the page first loads
**Then** the StickyNav starts transparent (no background)
**When** the user scrolls down past the hero
**Then** the StickyNav gains the surface background color with backdrop blur
**And** it remains sticky at the top (`position: sticky`)

**Given** any page other than the homepage
**When** the page loads
**Then** the StickyNav always displays with the surface background (never transparent)

**Given** a nav link
**When** hovered
**Then** the text color transitions from secondary to primary (0.2s ease)
**And** the active link displays in accent amber

**Given** a mobile viewport
**When** the nav renders
**Then** the horizontal layout remains functional down to ~380px width

### Story 1.5: Footer & Link Hierarchy

As a visitor,
I want a clean footer and consistent link styling throughout the site,
So that the site feels polished and interactive elements behave predictably.

**Acceptance Criteria:**

**Given** any page on the site
**When** the Footer renders
**Then** it displays the wordmark and copyright text
**And** it does not duplicate any links from the navigation
**And** it uses the `<footer>` landmark element

**Given** the link hierarchy is implemented
**When** a primary CTA link is rendered
**Then** it has a solid amber background with dark text
**And** there is maximum one primary CTA per viewport

**When** a text link with underline is rendered (conversion moments like email, CTAs)
**Then** it displays in amber text with a 2px amber underline

**When** an inline link within prose content is rendered
**Then** it displays in amber text with underline appearing on hover

**When** a nav link is rendered
**Then** it displays in secondary color, transitions to primary on hover, and is amber when active

**Given** any interactive element with a hover state
**When** hovered
**Then** color transitions complete in 0.2s ease
**And** card transforms and border transitions complete in 0.3s ease
**And** no transition exceeds 0.4s

### Story 1.6: Cloudflare Pages Deployment

As a content author,
I want the site automatically deployed when I push to main,
So that publishing new content requires only a git push with no manual deployment steps.

**Acceptance Criteria:**

**Given** the Cloudflare Pages project is configured
**When** code is pushed to the `main` branch
**Then** Cloudflare Pages automatically builds and deploys the site
**And** all 5 routes are accessible on the production URL

**Given** a pull request or non-main branch push
**When** code is pushed
**Then** a preview build is generated with a unique preview URL

**Given** a successful deployment
**When** visiting any of the 5 routes
**Then** pages render correctly with no build errors
**And** static assets are served via Cloudflare CDN

## Epic 2: Homepage Experience

Visitors land on a compelling, narrative-driven homepage that communicates Mike's value proposition through editorial scroll flow with animated reveals and a clear path to engagement.

### Story 2.1: HeroChapter Component

As a visitor landing on the homepage,
I want an impactful first-viewport experience with a clear value statement,
So that I immediately understand what this person can do for me.

**Acceptance Criteria:**

**Given** the homepage loads
**When** the HeroChapter renders
**Then** it occupies `min-height: 90vh` (80vh on mobile)
**And** the headline is rendered in Sora Bold at fluid size (clamp 2.5rem–4rem) with the key phrase in amber
**And** a subtitle in Satoshi, secondary color, positions Mike as the experienced guide
**And** a scroll hint in monospace appears at the bottom

**Given** the page loads with motion allowed
**When** the hero animation plays
**Then** the headline fades up over 0.8s
**And** the subtitle follows with 0.3s delay
**And** the scroll hint appears last with 0.8s delay

**Given** the user has `prefers-reduced-motion: reduce` enabled
**When** the page loads
**Then** all hero content appears immediately with no animation

### Story 2.2: ChapterLabel & POVSection Components

As a visitor scrolling the homepage,
I want to encounter a clearly labeled point-of-view statement,
So that I recognize "this person understands my world."

**Acceptance Criteria:**

**Given** the ChapterLabel component
**When** rendered
**Then** it displays small monospace text in amber with slight opacity
**And** it is reusable across homepage sections ("Point of View," "What I Bring," "Recent Writing")

**Given** the POVSection is added to the homepage below the hero
**When** it renders
**Then** a ChapterLabel reading "Point of View" appears above the blockquote
**And** the blockquote displays the brand thesis in Sora Medium at ~2rem with a 2px left amber border
**And** the section has a full-width surface-color background with content constrained to max-width

### Story 2.3: PillarGrid Section

As a visitor,
I want to quickly understand the three core things Mike brings to engagements,
So that I can assess whether his expertise matches my needs.

**Acceptance Criteria:**

**Given** the PillarGrid is added to the homepage below the POV section
**When** it renders
**Then** a ChapterLabel reading "What I Bring" appears above the grid
**And** 3 value pillars are displayed in a CSS grid: Builder Who Reads Systems, Problem Translator, Production Not Prototypes
**And** each pillar has a heading (Sora Semibold) and short description (Satoshi, secondary color)
**And** pillars are separated by 1px gap-based grid borders

**Given** a desktop viewport
**When** the grid renders
**Then** all 3 pillars display in a single row (3-column grid)

**Given** a mobile viewport
**When** the grid renders
**Then** pillars stack vertically (1-column)

### Story 2.4: BlogCard & Recent Writing Section

As a visitor,
I want to see recent blog posts on the homepage,
So that I can assess the quality of Mike's thinking and find content relevant to my situation.

**Acceptance Criteria:**

**Given** the Recent Writing section is added to the homepage below the pillars
**When** it renders
**Then** a ChapterLabel reading "Recent Writing" appears above the cards
**And** up to 3 most recent blog posts are displayed as BlogCards, date-sorted (newest first)
**And** a "View all" link to `/blog` is shown if more than 3 posts exist

**Given** a BlogCard
**When** rendered
**Then** it displays date (JetBrains Mono, amber) + title (Sora Semibold) + summary (Satoshi, secondary)
**And** the entire card is a single `<a>` element linking to the post

**Given** a BlogCard is hovered
**When** the cursor enters the card
**Then** the border turns amber and the card lifts (translateY -3px) with 0.3s ease transition

**Given** a desktop viewport
**When** the BlogCard grid renders
**Then** cards display in 3 columns
**Given** a tablet viewport
**Then** cards display in 2 columns
**Given** a mobile viewport
**Then** cards stack in 1 column

**Given** no blog posts exist yet
**When** the Recent Writing section renders
**Then** the section handles the empty state gracefully (hidden or shows a placeholder)

### Story 2.5: CTASection Component

As a convinced visitor,
I want a clear, low-friction way to reach out at the bottom of the homepage,
So that I never have to work to find contact information.

**Acceptance Criteria:**

**Given** the CTASection is added to the homepage as the closing section
**When** it renders
**Then** it displays a heading ("Let's talk." or similar)
**And** a subtitle ("I take on a small number of advisory and project engagements.")
**And** an email link (mike@hentges.ai) styled in amber with underline
**And** the section is simple and direct — no form, no calendar widget

**Given** the CTASection component
**When** used on other pages (About)
**Then** it renders identically, confirming reusability

### Story 2.6: Homepage Scroll Animations

As a visitor scrolling the homepage,
I want sections to reveal with subtle animation as I scroll,
So that the experience feels polished and editorial, like a curated narrative.

**Acceptance Criteria:**

**Given** the homepage with all sections in place
**When** a section scrolls into the viewport
**Then** it reveals with a fade + translate-up animation via IntersectionObserver
**And** each section animates independently as it enters view

**Given** JavaScript is disabled or unavailable
**When** the homepage renders
**Then** all section content is fully visible (progressive enhancement — animations are layered on, not required)

**Given** the user has `prefers-reduced-motion: reduce` enabled
**When** scrolling the homepage
**Then** no scroll-triggered animations play — all content is immediately visible

## Epic 3: Blog & Content System

Visitors can browse all blog posts, read individual articles with a polished reading experience, and discover the author. Mike can publish new content via Markdown + git push. Existing tech/AI content is migrated and hobby content is retired.

### Story 3.1: Content Collection & Schema

As a content author,
I want a validated content collection that enforces frontmatter structure,
So that every post has the required metadata and a co-located hero image optimized at build time.

**Acceptance Criteria:**

**Given** the content collection is configured
**When** `src/content/config.ts` is defined
**Then** the schema validates: `title` (string, required), `date` (date, required), `summary` (string, required), `hero` (image, required)
**And** `categories` and `attrib` fields are not in the schema

**Given** a post exists at `src/content/posts/sample-post/index.md` with a co-located `hero.jpg`
**When** the project builds
**Then** the content collection resolves the post successfully
**And** the hero image is processed by Astro's image optimization (Sharp) — resized, converted to WebP/AVIF, lazy-loaded
**And** no Cloudinary URLs are referenced

**Given** a post with missing or invalid frontmatter
**When** the project builds
**Then** the build fails with a clear Zod validation error identifying the issue

### Story 3.2: Blog Post Page with AuthorBio

As a visitor reading a blog post,
I want a clean, focused reading experience that ends with information about the author,
So that I can assess the writing quality and discover that consulting is available.

**Acceptance Criteria:**

**Given** a published blog post
**When** visiting `/blog/[slug]`
**Then** the page displays the post title (Sora Bold, h1) + date and reading time (JetBrains Mono) + prose content + AuthorBio
**And** content width is constrained to 680px max
**And** the page is wrapped in an `<article>` landmark

**Given** the prose content
**When** rendered
**Then** body text uses Satoshi at 1.125rem with 1.7 line-height
**And** code blocks use JetBrains Mono on code-bg background
**And** Tailwind typography plugin is applied with custom overrides matching the design system
**And** inline links within prose are amber with underline on hover

**Given** the reading time
**When** calculated
**Then** it is derived at build time from content length (words ÷ ~200 wpm)

**Given** the AuthorBio component renders below the post content
**When** displayed
**Then** it shows name, title, 2-3 sentence bio, and links (About, Contact, LinkedIn)
**And** it uses `<aside aria-label="About the author">`
**And** the LinkedIn link satisfies FR11 for blog posts
**And** it feels like a natural "about the author" block, not an advertisement

### Story 3.3: Blog Listing Page

As a visitor,
I want to browse all blog posts sorted by date,
So that I can find topics relevant to my interests.

**Acceptance Criteria:**

**Given** the blog listing page at `/blog`
**When** it renders
**Then** all published posts are displayed as BlogCards (component from Epic 2), sorted newest first
**And** the page has a clear heading (h1)

**Given** multiple blog posts exist
**When** viewing the listing
**Then** the BlogCard grid follows the responsive layout: 3 columns desktop, 2 tablet, 1 mobile
**And** each card links to the correct `/blog/[slug]` URL

**Given** the homepage Recent Writing section (Epic 2)
**When** more than 3 posts exist
**Then** the "View all" link correctly navigates to this `/blog` listing page

### Story 3.4: Content Migration & Hobby Retirement

As a site owner,
I want existing tech/AI blog posts migrated to the new content system and hobby content removed,
So that the site launches with a body of professional content that reinforces my consulting brand.

**Acceptance Criteria:**

**Given** existing tech/AI posts in the current site
**When** migrated
**Then** frontmatter is updated to match the new schema (title, date, summary, hero)
**And** hero images are downloaded from Cloudinary and co-located with each post (`src/content/posts/[post]/hero.jpg`)
**And** post content body is preserved as-is
**And** all migrated posts build successfully and render correctly at `/blog/[slug]`

**Given** existing chess, woodworking, and other hobby content
**When** migration is complete
**Then** all hobby posts are removed entirely from the content directory
**And** no hobby content appears in the blog listing or anywhere on the site

**Given** all migrated posts
**When** the site builds
**Then** build completes without errors
**And** all post images are optimized via Astro's image pipeline (no remaining Cloudinary references)

## Epic 4: About & Contact Pages

Prospects can learn about Mike's career depth across three professional threads and easily reach out via direct email or LinkedIn.

### Story 4.1: About Page

As a prospect evaluating Mike's credibility,
I want to read about his career depth across enterprise, manufacturing, and AI,
So that I can confirm he has the experience to advise on my situation.

**Acceptance Criteria:**

**Given** the About page at `/about`
**When** it renders
**Then** it presents a career narrative weaving three professional threads: enterprise systems builder (20+ years CTO at Fortune 500 SI), manufacturing operations leader (3 years IT Director), and AI practitioner
**And** the narrative reinforces brand pillars without reading like a resume
**And** the page has a proper heading (h1) and follows the 680px prose max-width

**Given** the About page content
**When** the visitor reaches the bottom
**Then** a CTASection (reused from Epic 2) appears with heading, subtitle, and email link
**And** the CTA provides a natural transition from "who is this person" to "how do I reach them"

**Given** the About page
**When** examined for accessibility
**Then** it uses semantic HTML with proper heading hierarchy
**And** it renders responsively across all breakpoints

### Story 4.2: Contact Page

As a convinced prospect,
I want a simple, direct way to reach out,
So that contacting Mike feels personal and low-friction, not like entering a sales funnel.

**Acceptance Criteria:**

**Given** the Contact page at `/contact`
**When** it renders
**Then** it displays a `mailto:mike@hentges.ai` link styled as a text link with amber underline
**And** a LinkedIn profile link is displayed (satisfying FR11 for the contact page)
**And** brief framing text appears: "I take on a small number of advisory and project engagements each year." or similar
**And** there is no contact form of any kind

**Given** the Contact page
**When** a visitor clicks the email link
**Then** their default email client opens with mike@hentges.ai as the recipient

**Given** the Contact page
**When** examined for design
**Then** the simplicity IS the trust signal — the page is intentionally minimal
**And** it renders responsively across all breakpoints

## Epic 5: SEO & Launch Readiness

The site is discoverable via search engines, shareable on social media with rich previews, meets all performance targets, and launches with fresh content.

### Story 5.1: SEOHead Component & Sitemap Configuration

As a site owner,
I want every page to have proper SEO metadata, structured data, and a sitemap,
So that the site is discoverable via search engines and shareable on social media with rich previews.

**Acceptance Criteria:**

**Given** the shared SEOHead component
**When** used by any page layout
**Then** it renders `<title>` and `<meta name="description">` with page-specific values
**And** Open Graph tags are present: `og:title`, `og:description`, `og:image`, `og:url`, `og:type`
**And** Twitter Card tags are present: `twitter:card` (summary_large_image), `twitter:title`, `twitter:description`, `twitter:image`
**And** a canonical URL `<link rel="canonical">` is set for each page

**Given** the homepage
**When** SEOHead renders
**Then** JSON-LD structured data includes `WebSite` and `Person` schema types

**Given** a blog post page
**When** SEOHead renders
**Then** JSON-LD structured data includes `BlogPosting` schema with title, date, author, and description

**Given** the About page
**When** SEOHead renders
**Then** JSON-LD structured data includes `Person` schema with professional details

**Given** the `@astrojs/sitemap` integration (installed in Epic 1)
**When** the site builds
**Then** a valid `sitemap.xml` is generated at the root containing all five routes and all blog post URLs
**And** the production site URL is correctly configured

**Given** the SEOHead component
**When** integrated into BaseLayout
**Then** every page on the site receives SEO metadata with no manual per-page wiring required beyond passing props

### Story 5.2: Performance Validation & Launch Readiness

As a site owner,
I want the site to meet all quality targets before launch,
So that the credibility platform performs as intended and doesn't undermine its purpose.

**Acceptance Criteria:**

**Given** the fully built site
**When** Lighthouse is run against the homepage
**Then** Performance score is >95 (NFR1)

**Given** the homepage
**When** page weight is measured (including all assets)
**Then** total weight is <500KB (NFR3)

**Given** the full site
**When** `pnpm build` is executed
**Then** build completes in <60 seconds (NFR4)

**Given** a new Markdown post is added and pushed to main
**When** Cloudflare Pages builds and deploys
**Then** the post is live on production in <30 minutes (NFR2)

**Given** the deployed site
**When** all pages are tested across modern evergreen browsers (Chrome, Firefox, Safari, Edge)
**Then** pages render correctly with no visual or functional regressions (NFR6)

**Given** the complete site
**When** reviewed holistically
**Then** it looks and feels finished — polished, intentional, and credible (NFR7)

### Story 5.3: Launch Blog Posts

As a site owner,
I want 1-2 fresh blog posts published at launch that reinforce the brand,
So that the site launches with current content that demonstrates my thinking, not just migrated archives.

**Acceptance Criteria:**

**Given** 1-2 new blog posts are written
**When** they are added to `src/content/posts/` with co-located hero images
**Then** frontmatter validates against the content schema (title, date, summary, hero)
**And** posts appear on the blog listing page and in the homepage Recent Writing section
**And** each post has a working AuthorBio block

**Given** the new launch posts
**When** reviewed for content
**Then** they reinforce brand themes (AI as accelerator, building the right thing, practitioner credibility)
**And** they demonstrate the voice and quality expected of the site going forward

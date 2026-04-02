# UX Design Specification — Hentges.AI

**Date:** 2026-04-02

---

## Design Direction

**Chosen: Narrative Flow** — scroll-driven homepage with chapter-labeled sections, animated entry reveals, and contrasting POV section. Editorial pacing, not marketing template.

**Aesthetic:** Confident, editorial, slightly irreverent. A respected CTO's Substack, not a consulting firm's brochure. The medium is the message — every design choice IS the portfolio.

**Tech stack:** Astro 4 static site, Tailwind CSS v4 + Tailwind Plus, Astro components only (no JS frameworks). Tailwind Plus provides structural layout patterns; all visual identity is custom.

---

## Design Principles

1. **Judgment on display** — Typography, whitespace, and restraint demonstrate the same taste Mike brings to consulting.
2. **Confidence through restraint** — Five routes. No sliders, no carousels, no popups. The absence of noise signals competence.
3. **Content earns trust, design confirms it** — Writing does the persuasion. Design's job is to not undermine it.
4. **Always one click from contact** — A convinced visitor should never work to reach out.
5. **Name it before they do** — The most powerful moment is when the visitor thinks "that's exactly my situation."

---

## Target Users & Key Scenarios

**Primary: Mid-market VP / IT Director** — Stuck between AI experimentation and real business value. Arrives via referral or Google. Spends 2-3 minutes: hero → POV → About → Contact. Must pass the 5-second credibility test.

**Primary: SI Firm CEO / CTO** — Running a delivery org where AI-built solutions need to survive production. Arrives via LinkedIn blog post. Reads content → discovers author bio → browses more posts → bookmarks. May not reach out for months.

**Secondary: Non-technical CEO** — Arrives via referral. The voice is calibrated for technical leaders, but this persona may visit.

**Critical success moments:**
- First viewport: "this person is serious" (earned in seconds, before a word is read)
- POV recognition: "this person understands my world" (converts browser to prospect)
- Bio block discovery: "oh, this person does consulting" (most common conversion path)
- Return visit: instant re-orientation from visual identity alone

---

## Color System

Editorial dark — warm charcoal with amber accent. Avoids both "developer dark mode" (cold/blue) and "luxury brand" (black/gold). Amber is deliberately contrarian for AI/tech — reads as "authoritative person" not "tech product."

| Role | Hex | Usage |
|------|-----|-------|
| Background | `#111113` | Page background |
| Surface | `#1a1a1f` | Cards, nav, elevated elements |
| Text primary | `#e8e4de` | Headings, body text (warm off-white) |
| Text secondary | `#9a958e` | Metadata, dates, de-emphasized text |
| Accent | `#d4a053` | Links, hover states, highlights |
| Accent hover | `#e4b563` | Interactive state brightening |
| Border | `#252528` | Subtle dividers and card edges |
| Code background | `#0d0d0f` | Code blocks |

Contrast: primary text >15:1 (AAA), accent >7:1 (AAA large text), secondary >4.5:1 (AA).

---

## Typography System

All fonts self-hosted via @font-face. No external CDN requests.

| Role | Font | Source |
|------|------|--------|
| Display | **Sora** | Google Fonts — rounded geometric, friendly-professional authority |
| Body | **Satoshi** | Fontshare — clean geometric, optimized for readability |
| Monospace | **JetBrains Mono** | Self-hosted — code blocks, dates, chapter labels |

**Type scale:**

| Element | Font | Size | Weight | Line Height |
|---------|------|------|--------|-------------|
| Hero heading | Sora | clamp(2.5rem, 5.5vw, 4rem) | 700 | 1.1 |
| Page heading (h1) | Sora | 2.5rem | 600 | 1.2 |
| Section heading (h2) | Sora | 1.75rem | 600 | 1.3 |
| Sub-heading (h3) | Satoshi | 1.25rem | 700 | 1.4 |
| Body text | Satoshi | 1.125rem | 400 | 1.7 |
| Small/meta | Satoshi | 0.875rem | 500 | 1.5 |
| Code | JetBrains Mono | 0.9375rem | 400 | 1.6 |

Body at 18px / 1.7 line height because dark backgrounds require larger text and more generous spacing for comfortable reading.

---

## Layout

- **Page max-width:** 1200px
- **Prose max-width:** 680px (65-75 characters per line)
- **Single column throughout** — no sidebars on any page
- **Generous vertical rhythm** — editorial calm through whitespace between sections
- **Mobile:** same structure, tighter spacing, reduced font sizes (hero 2.5rem, body 1rem). No horizontal scrolling. Min touch targets 44x44px.

---

## Components

### StickyNav

Wordmark ("Hentges`.ai`" with amber on `.ai`) left, nav links (Blog, About, Contact) right. `position: sticky`. On homepage: starts transparent over hero, gains surface background + backdrop blur on scroll. On other pages: always has background. `<nav>` landmark, `aria-current="page"` on active link. With only 4 items, horizontal layout works on mobile down to ~380px.

### HeroChapter (Homepage)

Full-viewport hero. Headline (Sora Bold, fluid clamp) + subtitle (Satoshi, secondary color) + scroll hint (monospace, bottom). Load animation: headline fades up (0.8s), subtitle follows (0.3s delay), scroll hint last (0.8s delay). `min-height: 90vh` (80vh on mobile). All animations behind `prefers-reduced-motion`.

### POVSection (Homepage)

Brand thesis delivery — the "slow down and read this" moment. Chapter label (monospace, amber) above a blockquote with left amber border (Sora Medium, ~2rem). Surface-color background to visually separate from main background. Full-width background, content constrained.

### PillarGrid (Homepage)

3 value pillars in a grid (single column on mobile). Each pillar: heading (Sora Semibold) + short description (Satoshi, secondary). 1px gap-based grid borders.

### BlogCard

Used on homepage and `/blog` listing. Date (monospace, amber) + title (Sora Semibold) + summary (Satoshi, secondary). Entire card is a single `<a>`. Hover: border turns amber, card lifts (translateY -3px). Grid: 3 columns desktop, 2 tablet, 1 mobile.

### AuthorBio

**The most important conversion element.** Appears after every blog post. Name + title + 2-3 sentence bio + links (About, Contact, LinkedIn). Must feel like "about the author," not an ad. `<aside aria-label="About the author">`. Natural part of the reading experience, not a bolted-on CTA.

### ChapterLabel (Homepage)

Small monospace text markers (amber, slight opacity) above each homepage section: "Point of View," "What I Bring," "Recent Writing." Create the narrative flow pacing.

### CTASection

Soft closing CTA at bottom of homepage and About page. Heading + subtitle + email link (amber, underlined). Simple and direct — no form, no calendar widget.

### BlogPostLayout

Title (Sora Bold, h1) + date/reading time (monospace) + prose content (Satoshi, Tailwind typography plugin with custom overrides) + AuthorBio. Content width: 680px max. Code blocks: JetBrains Mono on code-bg.

### Footer

Minimal. Wordmark + copyright. No link duplication from nav.

---

## Routes & Content Direction

### Home `/`

**Flow:** Hero → POV → Pillars → Recent Writing → CTA

| Section | Content |
|---------|---------|
| **Hero** | Headline: *"Help your team create more value, solve harder problems, and use AI to its full potential."* Amber emphasis on key phrase. Subtitle positions Mike as the experienced guide. |
| **POV** | *"AI changed what's possible — but you still need someone who knows how to build the right thing, the right way, for your situation."* |
| **Pillars** | Three value pillars drawn from brand pillars: Builder Who Reads Systems, Problem Translator, Production Not Prototypes. Short, punchy descriptions. |
| **Recent Writing** | 3 most recent BlogCards. "View all" link to `/blog` if >3 posts exist. |
| **CTA** | *"Let's talk."* / *"I take on a small number of advisory and project engagements."* / *"mike@hentges.ai →"* |

### Blog `/blog`

Flat list of all posts, date-sorted (newest first). Reuses BlogCard. No category filtering at launch — categories remain in frontmatter for future use but are not exposed in navigation or UI.

### Blog Post `/blog/[slug]`

Clean reading experience. Site identity via sticky nav. Article content in `<article>` landmark. AuthorBio below content. LinkedIn follow visible.

### About `/about`

Career depth page. Establishes the 20+ years of building, operating, and leading technology organizations. Should reinforce the brand pillars without reading like a resume. CTA section at bottom.

### Contact `/contact`

Direct and simple. `mailto:mike@hentges.ai` link + LinkedIn profile link. Brief framing: "I take on a small number of advisory and project engagements each year." No form. Simplicity IS the trust signal.

---

## Interaction Patterns

**Link hierarchy (consistent across all pages):**

| Type | Style | Usage |
|------|-------|-------|
| Primary CTA | Solid amber bg, dark text | Max one per viewport (homepage hero only) |
| Text link + underline | Amber text, 2px amber border | Conversion moments (email, CTAs) |
| Inline link | Amber text, underline on hover | Within prose content |
| Nav link | Secondary color, primary on hover, amber when active | Sticky navigation |

**Hover states on every interactive element.** Standard: 0.2s ease for color. Cards: 0.3s ease for transform + border. Never exceed 0.4s.

**Focus states:** 2px amber outline on `:focus-visible` only. Tab order follows visual order.

**Homepage animations:** Hero load reveals (fade + translate up, staggered delays). Scroll-triggered section reveals via IntersectionObserver (progressive enhancement — content visible without JS). All animations respect `prefers-reduced-motion`.

---

## Accessibility

**Target: WCAG 2.1 AA.**

- Skip link as first focusable element
- Semantic landmarks on every page: `<main>`, `<nav>`, `<article>`, `<aside>`, `<footer>`
- Proper heading hierarchy (never skip levels)
- `aria-current="page"` on active nav link
- `<html lang="en">`, unique `<title>` per route
- No information conveyed by color alone
- Minimum 14px for any text
- Keyboard-navigable throughout

---

## Open Questions

1. **Blog categories in UI** — Categories stay in frontmatter. Do we surface them as tags on blog cards/posts for visual interest, or keep the listing completely flat? Recommend: show as a subtle label on individual posts, but no filtering UI at launch.
2. **About page structure** — Narrative prose vs. structured sections (career timeline, philosophy, personal)? Recommend: narrative prose that weaves career depth into the brand story.
3. **Headshot** — AuthorBio spec allows for optional headshot. Include one or keep it text-only?

---

*Design directions exploration (6 options evaluated) archived at `_archive/ux-design-directions.html`.*

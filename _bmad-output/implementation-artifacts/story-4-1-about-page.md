# Story 4.1: About Page

Status: done

## Story

As a prospect evaluating Mike's credibility,
I want to read about his career depth across enterprise, manufacturing, and AI,
so that I can confirm he has the experience to advise on my situation.

## Acceptance Criteria

1. **Given** the About page at `/about`, **when** it renders, **then** it presents a career narrative weaving three professional threads: enterprise systems builder (20+ years CTO at Fortune 500 SI), manufacturing operations leader (3 years IT Director), and AI practitioner. The narrative reinforces brand pillars without reading like a resume. The page has a proper heading (h1) and follows the 680px prose max-width.

2. **Given** the About page content, **when** the visitor reaches the bottom, **then** a CTASection (reused from Epic 2) appears with heading, subtitle, and email link. The CTA provides a natural transition from "who is this person" to "how do I reach them."

3. **Given** the About page, **when** examined for accessibility, **then** it uses semantic HTML with proper heading hierarchy (h1 -> h2, never skip levels) and renders responsively across all breakpoints.

## Tasks / Subtasks

- [x] Task 1: Write About page content and structure (AC: 1, 3)
  - [x] 1.1 Replace placeholder in `src/pages/about.astro` with full page implementation
  - [x] 1.2 Write career narrative content weaving three threads: enterprise systems builder, manufacturing operations leader, AI practitioner
  - [x] 1.3 Structure content with semantic HTML: `<article>` wrapper, proper heading hierarchy (h1 -> h2 for each thread/section)
  - [x] 1.4 Apply `prose-width` class to article for 680px max content width
  - [x] 1.5 Use `prose prose-lg` wrapper for narrative body text (matches blog post pattern)
  - [x] 1.6 Ensure narrative tone is editorial — "who this person is" not "resume bullet points"

- [x] Task 2: Integrate CTASection component (AC: 2)
  - [x] 2.1 Import and render `CTASection` component at the bottom of the page, below the narrative content
  - [x] 2.2 Verify CTA appears as natural closing: "Let's talk." heading + subtitle + email link

- [x] Task 3: Responsive and accessibility verification (AC: 3)
  - [x] 3.1 Verify heading hierarchy: h1 (page title) -> h2 (section headings) — no skipped levels
  - [x] 3.2 Test responsive layout: mobile (single column, tighter spacing), tablet, desktop
  - [x] 3.3 Verify `aria-current="page"` is set on the "About" nav link in StickyNav (already handled by StickyNav component)
  - [x] 3.4 Run `pnpm build` — zero errors, page renders at `/about`

## Dev Notes

### Page Structure Pattern

Follow the established content page pattern from blog post pages:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import CTASection from '../components/CTASection.astro';
---

<BaseLayout title="About | Hentges.AI">
  <article class="prose-width py-12 md:py-16">
    <h1 class="font-display text-4xl font-bold leading-tight md:text-[2.5rem]">
      <!-- Page title -->
    </h1>
    <div class="prose prose-lg mt-8 max-w-none">
      <!-- Career narrative content as raw HTML sections -->
    </div>
  </article>
  <CTASection />
</BaseLayout>
```

### Key Implementation Details

- **No new components needed.** This is a content page using existing layout + CTASection.
- **CTASection import:** `import CTASection from '../components/CTASection.astro';` — component takes no props, renders identically everywhere.
- **BaseLayout props:** `title="About | Hentges.AI"` — do NOT pass `transparent={true}` (that's homepage-only).
- **Prose styling:** Wrap narrative text in `<div class="prose prose-lg mt-8 max-w-none">` — this activates Tailwind Typography with the dark theme overrides already defined in `global.css`.
- **prose-width class:** Already defined in global.css as `max-width: 680px` — apply to the `<article>` wrapper.
- **Spacing pattern:** `py-12 md:py-16` on article (matches blog post page).
- **h1 styling:** `font-display text-4xl font-bold leading-tight md:text-[2.5rem]` (matches blog post h1 pattern).

### Content Guidelines

The three career threads to weave into narrative:

1. **Enterprise Systems Builder** — 20+ years as CTO at a Fortune 500 systems integrator. Large-scale delivery, complex integrations, enterprise architecture.
2. **Manufacturing Operations Leader** — 3 years as IT Director at a mid-sized manufacturer. Hands-on operational technology, real-world production systems.
3. **AI Practitioner** — Applied AI expertise. Not theoretical — building real solutions that survive production.

**Tone:** The narrative should feel like the "about" section of a respected Substack author. Conversational but authoritative. Reinforce brand pillars (Builder Who Reads Systems, Problem Translator, Production Not Prototypes) without naming them explicitly. NOT a resume, NOT a LinkedIn profile, NOT a corporate bio.

**Structure suggestion:** A single flowing narrative with 2-3 section breaks (h2 headings) that naturally moves from "who I am" to "what I've learned" to "how I work." Each section weaves the threads together rather than treating them as separate career chapters.

### Anti-Patterns to Avoid

- Do NOT create new components for this page — it's a content page, not a component showcase
- Do NOT use `@apply` — Tailwind utility classes only
- Do NOT use raw hex colors — use theme tokens (`text-text-primary`, `text-text-secondary`, `text-accent`)
- Do NOT use raw `<img>` tags — use Astro `<Image>` component if any images are added
- Do NOT add `transparent` prop to BaseLayout (homepage-only feature)
- Do NOT skip heading levels (no h1 -> h3)
- Do NOT create a separate layout component — use BaseLayout directly

### Existing Components Reference

| Component | Import Path | Usage on About Page |
|-----------|-------------|-------------------|
| BaseLayout | `../layouts/BaseLayout.astro` | Page wrapper with nav + footer |
| CTASection | `../components/CTASection.astro` | Closing CTA at bottom |

### Project Structure Notes

- File to modify: `src/pages/about.astro` (replace existing placeholder)
- No new files needed
- Architecture doc confirms: `/about` route uses BaseLayout + CTASection only

### References

- [Source: _bmad-output/planning-artifacts/architecture.md — Route-Component Mapping]: `/about` uses BaseLayout + CTASection
- [Source: _bmad-output/planning-artifacts/epics.md — Story 4.1]: Full acceptance criteria and user story
- [Source: _bmad-output/planning-artifacts/prd.md — Scope]: About page with three career threads, narrative style
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md — Design Principles]: "Judgment on display", "Confidence through restraint"
- [Source: src/pages/blog/[slug].astro]: Content page pattern (article wrapper, prose styling, spacing)
- [Source: src/components/CTASection.astro]: Reusable CTA — no props, self-contained
- [Source: src/styles/global.css]: prose-width (680px), prose overrides, link hierarchy classes

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (1M context)

### Debug Log References

None — clean implementation, no debugging required.

### Completion Notes List

- Replaced placeholder about.astro with full career narrative page
- Three career threads woven into flowing editorial narrative with three h2 sections: "Twenty years inside enterprise delivery", "Then I went to the factory floor", "Now: making AI actually work"
- Tone matches homepage voice — conversational, authoritative, slightly irreverent. NOT resume-like.
- Reuses CTASection component at bottom for natural "who is this → how to reach them" transition
- Article wrapped in `prose-width` (680px) with `prose prose-lg` for Tailwind Typography
- Heading hierarchy: h1 → h2 (no skipped levels)
- Build passes: 0 errors, 10 pages built, /about/index.html generated
- No new components or files created — single file modification as specified

### File List

- `src/pages/about.astro` (modified — replaced placeholder with full implementation)

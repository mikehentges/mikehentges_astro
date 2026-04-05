---
title: 'ChapterLabel & POVSection Components'
type: 'feature'
created: '2026-04-05'
status: 'done'
baseline_commit: 'bd24834'
context:
  - '_bmad-output/planning-artifacts/ux-design-specification.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The homepage currently ends after the hero. The narrative scroll flow needs its next beat — a point-of-view statement that tells visitors "this person understands my world" — preceded by a reusable chapter label pattern used across all homepage sections.

**Approach:** Create a `ChapterLabel` component (small monospace amber label) and a `POVSection` component (full-width surface-background section with blockquote), then wire both into the homepage below the hero.

## Boundaries & Constraints

**Always:**
- Use only Tailwind utility classes (no `@apply`)
- Use only theme tokens (no raw hex values)
- Semantic HTML: `<blockquote>` for the quote, `<section>` with `aria-labelledby` for POVSection
- ChapterLabel must be reusable — it will appear above PillarGrid, Recent Writing, and CTA sections in future stories
- POVSection background must be full-width (break out of the 1200px container) while content stays constrained

**Ask First:**
- Changes to BaseLayout or the page-width container system

**Never:**
- JavaScript in these components — pure HTML/CSS
- New design tokens or font changes
- Modifications to HeroChapter

</frozen-after-approval>

## Code Map

- `src/components/ChapterLabel.astro` -- New. Reusable small monospace amber label.
- `src/components/POVSection.astro` -- New. Full-width surface section with chapter label + blockquote.
- `src/pages/index.astro` -- Add POVSection below HeroChapter.
- `src/styles/global.css` -- May need a utility for full-width breakout if not already possible with Tailwind.

## Tasks & Acceptance

**Execution:**
- [x] `src/components/ChapterLabel.astro` -- Create component accepting a `text` prop, rendering monospace amber text at small size with slight opacity
- [x] `src/components/POVSection.astro` -- Create component with full-width surface background, ChapterLabel ("Point of View"), and blockquote with 2px left amber border in Sora Medium ~2rem. Placeholder copy: "Most teams don't have a technology problem. They have a clarity problem — too many tools, too little alignment, and no one connecting what the business needs to what the systems can do."
- [x] `src/pages/index.astro` -- Import and add POVSection below HeroChapter

**Acceptance Criteria:**
- Given the homepage, when scrolling past the hero, then a "Point of View" chapter label appears above a blockquote on a surface-colored background
- Given the POVSection, when viewed on any viewport width, then the surface background spans full viewport width while blockquote content stays within max-width
- Given the ChapterLabel component, when rendered with different text values, then it displays consistently in monospace amber with slight opacity
- Given the blockquote, when rendered, then it uses Sora Medium at ~2rem with a 2px left amber border
- Given a mobile viewport, when viewing the POVSection, then text sizes reduce appropriately and spacing tightens

## Verification

**Commands:**
- `pnpm build` -- expected: builds without errors or type warnings
- `pnpm dev` -- expected: homepage shows hero followed by POV section with correct styling

**Manual checks:**
- POVSection surface background bleeds to full viewport width on desktop
- ChapterLabel renders in monospace, amber, with reduced opacity
- Blockquote has visible 2px left amber border
- Responsive: section looks correct at mobile, tablet, and desktop widths

## Suggested Review Order

- Homepage wiring — single entry point showing both new components in use
  [`index.astro:7`](../../src/pages/index.astro#L7)

- Full-width breakout pattern with `100vw` inline style, surface background, constrained inner content
  [`POVSection.astro:5`](../../src/components/POVSection.astro#L5)

- Reusable chapter label as `<h2>` with monospace amber styling and optional `id` for `aria-labelledby`
  [`ChapterLabel.astro:10`](../../src/components/ChapterLabel.astro#L10)

- `overflow-x: hidden` on body to prevent horizontal scrollbar from `100vw` pattern
  [`global.css:37`](../../src/styles/global.css#L37)

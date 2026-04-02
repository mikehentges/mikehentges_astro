---
title: 'Base Layout & Accessibility Foundations'
type: 'feature'
created: '2026-04-03'
status: 'done'
baseline_commit: 'e3103e1'
context:
  - '_bmad-output/planning-artifacts/ux-design-specification.md'
  - '_bmad-output/planning-artifacts/architecture.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** BaseLayout.astro is a bare HTML shell with no layout constraints, no skip link, no focus styles, and no responsive adjustments. Every subsequent component (nav, hero, cards) depends on these foundations being in place — without them, nothing aligns or meets WCAG 2.1 AA.

**Approach:** Enhance BaseLayout with a skip link, 1200px page container, and landmark structure. Add global focus-visible styles, mobile-responsive typography adjustments, and a reusable `.prose-width` constraint (680px) in global.css.

## Boundaries & Constraints

**Always:** Use Tailwind utility classes in templates (no `@apply`). Reference design tokens only through Tailwind theme — no raw hex values. Skip link must be the first focusable element in DOM order.

**Ask First:** Adding any new npm dependencies.

**Never:** Add StickyNav or Footer components (stories 1.4, 1.5). Add `@tailwindcss/typography` (story 3.2). Restructure page files beyond what's needed for landmark compliance.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Skip link activation | Tab as first action on any page | "Skip to content" link appears, activating it moves focus to `<main>` | N/A |
| Skip link hidden until focused | Page loads normally | Skip link is visually hidden but in DOM, appears on `:focus` | N/A |
| Focus-visible on link | Keyboard-focus any link | 2px amber (`--color-accent`) outline visible | N/A |
| Focus via mouse click | Click any link | No focus outline shown (`:focus-visible` only) | N/A |
| Mobile viewport (<768px) | Render any page on small screen | Body text 1rem, tighter spacing, no horizontal scroll | N/A |
| Wide viewport (>1200px) | Render any page on wide screen | Content constrained to 1200px, centered | N/A |

</frozen-after-approval>

## Code Map

- `src/layouts/BaseLayout.astro` -- Root HTML wrapper; add skip link, container, landmark structure
- `src/styles/global.css` -- Global styles; add focus-visible, skip link, responsive rules, prose-width

## Tasks & Acceptance

**Execution:**
- [x] `src/styles/global.css` -- Add skip link styles (visually hidden, visible on focus), `:focus-visible` 2px amber outline on all interactive elements, `.prose-width` class (max-width 680px), and mobile-responsive typography (`@media` below 768px: body 1rem, tighter vertical rhythm)
- [x] `src/layouts/BaseLayout.astro` -- Add skip link as first child of `<body>`, wrap page content in a centered 1200px max-width container, add `id="content"` on `<main>` for skip link target, preserve existing slot structure

**Acceptance Criteria:**
- Given any page, when rendered, then content is constrained to 1200px max-width and centered
- Given a keyboard user pressing Tab first, then "Skip to content" link appears and activating it moves focus to `<main id="content">`
- Given any interactive element focused via keyboard, then a 2px amber outline is visible
- Given a mobile viewport (<768px), then body text is 1rem with no horizontal scrolling
- Given the HTML source, then `<html lang="en">` and unique `<title>` per page are present (already done — verify preserved)

## Verification

**Commands:**
- `pnpm build` -- expected: builds with no errors
- `npx astro check` -- expected: no type errors

**Manual checks:**
- Open localhost:4321 in browser, press Tab — skip link should appear and function
- Resize to mobile width — text size reduces, no horizontal scroll
- Widen beyond 1200px — content stays centered with constrained width

## Suggested Review Order

**Layout structure (start here)**

- Skip link + 1200px container + main landmark with tabindex for focus target
  [`BaseLayout.astro:20`](../../src/layouts/BaseLayout.astro#L20)

**Global accessibility & responsive styles**

- Skip link hidden/reveal mechanism and amber focus-visible outline
  [`global.css:79`](../../src/styles/global.css#L79)

- Prose-width constraint class (680px) for future content areas
  [`global.css:103`](../../src/styles/global.css#L103)

- Mobile typography overrides: body 1rem, reduced heading sizes below 768px
  [`global.css:110`](../../src/styles/global.css#L110)

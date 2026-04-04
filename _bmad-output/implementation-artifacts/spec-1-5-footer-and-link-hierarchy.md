---
title: 'Footer & Link Hierarchy'
type: 'feature'
created: '2026-04-04'
status: 'done'
baseline_commit: 'ba0059a'
context:
  - '_bmad-output/planning-artifacts/ux-design-specification.md'
  - '_bmad-output/planning-artifacts/architecture.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The site has no footer component and no consistent link styling system. Links across the site (CTAs, inline prose links, email links) have no defined visual hierarchy, making interactive elements unpredictable.

**Approach:** Build a minimal Footer component (wordmark + copyright, no nav duplication) and implement four link style tiers as Tailwind utility classes in global.css, then integrate the footer into BaseLayout.

## Boundaries & Constraints

**Always:**
- Footer uses `<footer>` landmark element
- Link styles use only existing design tokens (accent, accent-hover, text-primary, text-secondary)
- Color transitions 0.2s ease, transforms 0.3s ease, nothing exceeds 0.4s
- No `@apply` — Tailwind utility classes only in component templates
- Link hierarchy classes defined in global.css for site-wide reuse

**Ask First:**
- If footer content should include anything beyond wordmark + copyright (e.g., a tagline, social link)

**Never:**
- Duplicate nav links (Blog, About, Contact) in the footer
- Add JavaScript to the footer
- Use raw hex values — only Tailwind theme tokens
- Create more than one primary CTA per viewport in any page

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Footer on all pages | Any route renders | `<footer>` visible with wordmark + © year | N/A |
| Primary CTA link | Element with `.link-cta` | Solid amber bg, dark text, hover lightens | N/A |
| Text link (conversion) | Element with `.link-text` | Amber text + 2px amber underline, hover brightens | N/A |
| Inline prose link | `a` inside `.prose-width` or prose context | Amber text, underline on hover only | N/A |
| Nav link (existing) | StickyNav links | Secondary → primary hover, amber active (already done) | N/A |
| Keyboard focus on any link | Tab to link | 2px amber outline via existing `:focus-visible` (already done) | N/A |

</frozen-after-approval>

## Code Map

- `src/components/Footer.astro` -- New component: wordmark + copyright, `<footer>` landmark
- `src/layouts/BaseLayout.astro` -- Add Footer component after `</main>` closing tag
- `src/styles/global.css` -- Add link hierarchy utility classes (`.link-cta`, `.link-text`, inline prose `a` styles)

## Tasks & Acceptance

**Execution:**
- [x] `src/styles/global.css` -- Add link hierarchy styles: `.link-cta` (solid amber bg, dark text, hover), `.link-text` (amber + 2px underline, hover), prose inline `a` (amber, underline-on-hover), and shared transition timing
- [x] `src/components/Footer.astro` -- Create footer with wordmark ("Hentges" + ".ai" in amber), copyright with dynamic year, `<footer>` landmark, centered layout matching site max-width
- [x] `src/layouts/BaseLayout.astro` -- Import and place Footer component after `</main>`, before `</body>`

**Acceptance Criteria:**
- Given any page, when rendered, then a `<footer>` landmark is visible at the bottom with wordmark and copyright
- Given the footer, when inspected, then it contains no links that duplicate the StickyNav (Blog, About, Contact)
- Given an element with class `link-cta`, when rendered, then it has solid amber background with dark text
- Given an element with class `link-text`, when rendered, then it has amber text with 2px amber underline
- Given an inline link inside prose content, when hovered, then underline appears with 0.2s transition
- Given any link with a hover state, when hovered, then transition completes within 0.2s (colors) or 0.3s (transforms)

## Verification

**Commands:**
- `pnpm build` -- expected: zero errors, clean build
- `npx astro check` -- expected: no type errors

**Manual checks:**
- All 5 routes show footer at bottom with wordmark + copyright
- Footer has no nav link duplication
- Link styles render correctly per hierarchy when applied to test elements

## Suggested Review Order

**Link hierarchy styles**

- Four link tiers defined as reusable CSS classes with design-token colors and 0.2s transitions
  [`global.css:115`](../../src/styles/global.css#L115)

**Footer component**

- Minimal wordmark + dynamic copyright year, `<footer>` landmark, centered at 1200px
  [`Footer.astro:1`](../../src/components/Footer.astro#L1)

**Layout integration**

- Flexbox sticky-footer pattern on body, Footer placed after main content
  [`BaseLayout.astro:22`](../../src/layouts/BaseLayout.astro#L22)

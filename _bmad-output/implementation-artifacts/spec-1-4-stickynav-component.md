---
title: 'StickyNav Component'
type: 'feature'
created: '2026-04-03'
status: 'done'
baseline_commit: '2e230fd'
context:
  - '_bmad-output/planning-artifacts/ux-design-specification.md'
  - '_bmad-output/planning-artifacts/architecture.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The site has no navigation. Visitors can't move between pages or identify the site brand. The homepage needs a transparent-to-solid nav transition for the future hero section, while other pages need a solid nav always.

**Approach:** Create a `StickyNav.astro` component with wordmark + nav links, integrate it into `BaseLayout.astro`, and use a `transparent` prop + scroll listener to handle the homepage's transparent-to-solid transition.

## Boundaries & Constraints

**Always:** Use Tailwind utility classes only (no `@apply`). Use `<nav>` landmark. Apply `aria-current="page"` on the active link. Use theme color tokens — no raw hex. Transition timing: 0.2s ease for color changes.

**Ask First:** If the scroll threshold for transparent-to-solid transition needs adjustment once the hero exists (Story 2.1).

**Never:** Add a hamburger/mobile menu (horizontal layout works to ~380px per UX spec). Don't add a home link in the nav links — the wordmark serves that role.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Homepage load | `transparent={true}`, scrollY=0 | Nav is transparent, no background | N/A |
| Homepage scrolled | `transparent={true}`, scrollY > threshold | Nav gains surface bg + backdrop blur | N/A |
| Non-homepage | `transparent={false}` (default) | Nav always has surface bg | N/A |
| Active page detection | Current URL matches nav link href | That link gets `aria-current="page"` + accent color | N/A |
| JS disabled | Homepage with `transparent={true}` | Nav shows solid background (safe fallback) | Progressive enhancement — solid is the safe default |

</frozen-after-approval>

## Code Map

- `src/components/StickyNav.astro` -- New component: wordmark + nav links, sticky positioning, scroll-aware transparency
- `src/layouts/BaseLayout.astro` -- Add StickyNav import, accept + pass `transparent` prop, restructure body to place nav outside max-width container
- `src/pages/index.astro` -- Pass `transparent={true}` to BaseLayout
- `src/styles/global.css` -- No changes expected (tokens already defined)

## Tasks & Acceptance

**Execution:**
- [x] `src/components/StickyNav.astro` -- Create component with wordmark ("Hentges" + ".ai" in accent), nav links (Blog, About, Contact), `aria-current="page"` detection via `Astro.url.pathname`, `transparent` prop controlling initial background state, inline `<script>` for scroll-triggered class toggle on `[data-transparent]` elements
- [x] `src/layouts/BaseLayout.astro` -- Import and render StickyNav above the content container, add `transparent` prop to interface and pass through, ensure nav is full-width (outside the `max-w-[1200px]` container) while nav content is constrained to 1200px
- [x] `src/pages/index.astro` -- Pass `transparent={true}` to BaseLayout

**Acceptance Criteria:**
- Given any page, when StickyNav renders, then wordmark "Hentges.ai" appears left with ".ai" in accent amber, and nav links (Blog, About, Contact) appear right
- Given the homepage at scrollY=0, when rendered, then nav background is transparent
- Given the homepage after scrolling, when scrollY passes threshold, then nav gains surface background with backdrop blur via CSS transition
- Given any non-homepage, when rendered, then nav always has surface background
- Given the current page matches a nav link, when rendered, then that link has `aria-current="page"` and displays in accent color
- Given a nav link, when hovered, then text transitions from secondary to primary color in 0.2s ease
- Given a mobile viewport (~380px+), when rendered, then horizontal layout remains functional with no overflow

## Verification

**Commands:**
- `pnpm build` -- expected: builds without errors or type warnings
- `pnpm dev` -- expected: all 5 routes render with nav, active link highlights correctly per route

**Manual checks:**
- Homepage: nav is transparent at top, solid after scroll
- Other pages: nav is always solid
- Hover states transition smoothly
- Keyboard tab reaches all nav links with visible focus ring

## Resume Point

**Status:** Complete.

## Suggested Review Order

- Component entry point: wordmark, nav links, `aria-current` detection, conditional transparency
  [`StickyNav.astro:20`](../../src/components/StickyNav.astro#L20)

- Scroll-aware transparency: JS listener toggles classes above threshold
  [`StickyNav.astro:63`](../../src/components/StickyNav.astro#L63)

- Progressive enhancement: noscript fallback forces solid background when JS disabled
  [`StickyNav.astro:54`](../../src/components/StickyNav.astro#L54)

- Layout integration: StickyNav placed full-width above content container, transparent prop threaded
  [`BaseLayout.astro:23`](../../src/layouts/BaseLayout.astro#L23)

- Homepage opt-in: passes `transparent={true}` for hero-ready transparent nav
  [`index.astro:5`](../../src/pages/index.astro#L5)

---
title: 'HeroChapter Component'
type: 'feature'
created: '2026-04-05'
status: 'done'
baseline_commit: '632e664'
context:
  - '_bmad-output/planning-artifacts/ux-design-specification.md'
  - '_bmad-output/planning-artifacts/architecture.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The homepage is a placeholder `<h1>Home</h1>`. Visitors need a compelling first-viewport experience that immediately communicates Mike's value proposition and sets the editorial tone.

**Approach:** Create a `HeroChapter.astro` component — full-viewport hero with fluid headline (key phrase in amber), subtitle, and scroll hint. Staggered CSS-only load animation behind `prefers-reduced-motion`. Wire it into the homepage.

## Boundaries & Constraints

**Always:**
- Use Tailwind utility classes only (no `@apply`)
- Use theme tokens for all colors — no raw hex
- Animations must be CSS-only (keyframes + animation-delay), no JS animation libraries
- All animated content must be immediately visible when `prefers-reduced-motion: reduce` is active
- Hero must render fully without JavaScript (progressive enhancement)

**Ask First:**
- Headline copy changes beyond the UX spec wording
- Adding any interactive elements to the hero

**Never:**
- JavaScript-driven animations for the hero reveal
- Raw `<img>` tags
- Horizontal scrolling on any viewport

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Desktop load | Viewport ≥768px | Hero at 90vh, fluid headline ~4rem, staggered animation plays | N/A |
| Mobile load | Viewport <768px | Hero at 80vh, headline clamps to ~2.5rem, same animation | N/A |
| Reduced motion | `prefers-reduced-motion: reduce` | All content visible instantly, no animation | N/A |
| Narrow viewport | ~320px width | Content wraps naturally, no overflow, scroll hint visible | N/A |

</frozen-after-approval>

## Code Map

- `src/components/HeroChapter.astro` -- New component: hero markup + scoped animation keyframes
- `src/pages/index.astro` -- Import and render HeroChapter, replace placeholder content

## Tasks & Acceptance

**Execution:**
- [x] `src/components/HeroChapter.astro` -- Create component with headline, subtitle, scroll hint, and scoped CSS animation keyframes with staggered delays (0s, 0.3s, 0.8s). Use `<style>` block for keyframes and `prefers-reduced-motion` media query.
- [x] `src/pages/index.astro` -- Replace `<h1>Home</h1>` with `<HeroChapter />`. Keep BaseLayout wrapper with `transparent={true}`.

**Acceptance Criteria:**
- Given the homepage loads, when the HeroChapter renders, then it occupies min-height 90vh (80vh on mobile) with centered content
- Given the headline, when rendered, then key phrase displays in amber (`text-accent`) and uses Sora Bold at fluid size (`font-size-hero` token)
- Given motion is allowed, when the page loads, then headline fades up over 0.8s, subtitle follows at 0.3s delay, scroll hint at 0.8s delay
- Given `prefers-reduced-motion: reduce`, when the page loads, then all content is immediately visible with no animation
- Given the scroll hint, when rendered, then it displays in monospace (`font-code`) at the bottom of the hero

## Design Notes

**Headline copy** (from UX spec): *"Help your team create more value, solve harder problems, and use AI to its full potential."* — amber emphasis on a key phrase (e.g., "use AI to its full potential").

**Subtitle copy** (from UX spec): Positions Mike as the experienced guide. E.g., *"I'm Mike Hentges — 20+ years building technology organizations, now helping leaders navigate what AI actually changes."*

**Scroll hint:** Small monospace text like "Scroll to explore ↓" anchored near the bottom of the hero viewport.

**Animation approach:** CSS `@keyframes fadeUp` on a scoped `<style>` block. Each element gets `animation-delay` for staggering. Elements start with `opacity: 0; transform: translateY(1rem)` and animate to final position. The `prefers-reduced-motion` query sets `animation: none` and resets opacity/transform to visible defaults.

## Verification

**Commands:**
- `pnpm build` -- expected: build succeeds with no errors or warnings
- `npx astro check` -- expected: no type errors

**Manual checks:**
- Homepage renders hero at full viewport height with correct typography and amber accent
- Animation staggers correctly on page load (headline → subtitle → scroll hint)
- With reduced motion preference, all content appears instantly
- No horizontal scroll on mobile viewports (320px+)

## Suggested Review Order

- Entry point: full-viewport hero with semantic landmark, fluid type, and staggered animation classes
  [`HeroChapter.astro:4`](../../src/components/HeroChapter.astro#L4)

- CSS-only animation: explicit from/to keyframes, delay classes, and reduced-motion reset
  [`HeroChapter.astro:19`](../../src/components/HeroChapter.astro#L19)

- Homepage integration: HeroChapter replaces placeholder, transparent nav preserved
  [`index.astro:1`](../../src/pages/index.astro#L1)

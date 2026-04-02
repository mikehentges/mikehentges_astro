---
title: 'Design Tokens & Typography System'
type: 'feature'
created: '2026-04-03'
status: 'done'
baseline_commit: '36413b4'
context:
  - '_bmad-output/planning-artifacts/ux-design-specification.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The site has no design token system — no color palette, no type scale, and no Tailwind theme configuration. Every subsequent component (nav, hero, cards, layouts) will need these tokens, making this the critical-path blocker for all visual work.

**Approach:** Define all 8 color tokens and the 7-level type scale in a Tailwind v4 `@theme` block inside `global.css`. Wire font-family assignments to the Astro-injected CSS variables. Establish base body/heading styles so downstream components can use utility classes immediately.

## Boundaries & Constraints

**Always:**
- All colors defined as Tailwind v4 `@theme` tokens — never raw hex in components
- Font families reference the CSS variables injected by Astro Fonts API (`--font-sora`, `--font-satoshi`, `--font-mono`)
- No `@apply` — all styling via utility classes in component templates or base element styles in `global.css`
- `global.css` is the single source of truth for design tokens

**Ask First:**
- Adding any color tokens beyond the specified 8
- Installing `@tailwindcss/typography` (needed later for prose, not in this story)

**Never:**
- Create a `tailwind.config.ts` file — Tailwind v4 uses CSS-first configuration
- Use raw hex values in any `.astro` file
- Add component-level or page-level styles — this story is tokens and base styles only

</frozen-after-approval>

## Code Map

- `src/styles/global.css` -- Add `@theme` block with color tokens, font-family tokens, and type scale custom properties; update base element styles
- `src/layouts/BaseLayout.astro` -- Verify it imports `global.css` and applies background/text-primary to `<body>` (may need `class` attribute)

## Tasks & Acceptance

**Execution:**
- [x] `src/styles/global.css` -- Add `@theme` block defining 8 color tokens (`--color-background`, `--color-surface`, `--color-text-primary`, `--color-text-secondary`, `--color-accent`, `--color-accent-hover`, `--color-border`, `--color-code-bg`), 3 font-family tokens, and type scale custom properties for the 7 levels
- [x] `src/styles/global.css` -- Update base element styles: `body` gets background + text-primary + body font size/line-height; headings get Sora with respective scale values; `code`/`pre` get mono font + code-bg
- [x] `src/layouts/BaseLayout.astro` -- Add `bg-background text-text-primary` utility classes to `<body>` element so default page colors apply site-wide

**Acceptance Criteria:**
- Given any `.astro` component, when using `bg-surface` or `text-accent`, then Tailwind resolves the token to the correct hex value
- Given the dev server running, when inspecting the `<body>` element, then background is `#111113` and text color is `#e8e4de`
- Given the built site, when checking network requests, then zero external font CDN requests are made (fonts already self-hosted via Astro Fonts API from Story 1.1)
- Given the type scale, when an `<h1>` renders, then it uses Sora at 2.5rem/600 weight; `<h2>` at 1.75rem/600; `<h3>` at Satoshi 1.25rem/700; body at 1.125rem/400/1.7 line-height

## Verification

**Commands:**
- `pnpm build` -- expected: build completes with no errors
- `npx astro check` -- expected: no type errors

**Manual checks:**
- Dev server shows dark background (#111113) with warm off-white text (#e8e4de) on all placeholder pages
- Headings render in Sora, body in Satoshi, code in JetBrains Mono
- Tailwind IntelliSense (if available) autocompletes `bg-background`, `text-accent`, etc.

## Suggested Review Order

- Entry point: `@theme` block — all 8 color tokens, 3 font families, and hero/small type scale properties
  [`global.css:3`](../../src/styles/global.css#L3)

- Base element styles — body, h1-h3, h4-h6, code/pre with type scale values from UX spec
  [`global.css:26`](../../src/styles/global.css#L26)

- Inline code gets font properties only; `pre` gets its own line-height to avoid paragraph interference
  [`global.css:68`](../../src/styles/global.css#L68)

- Body element wired to token utilities as a safety net alongside base CSS
  [`BaseLayout.astro:19`](../../src/layouts/BaseLayout.astro#L19)

# Deferred Work

## Deferred from: code review of 1-1-project-initialization-and-toolchain (2026-04-02)

- No `404.astro` page — old catch-all route deleted, default Astro 404 will show for any unmatched URL. Consider adding a branded 404 page in a future story.
- No redirects for old URL structure — posts moved from `/<slug>` to `/blog/<slug>`, all external links and SEO break. Address in Story 3.4 (content migration) or Story 1.6 (deployment config).
- `/favicon.ico` requests will 404 — `favicon.svg` exists and works for modern browsers, but some tools/browsers still request `.ico` by convention. Consider adding a favicon.ico or redirect.

## Deferred from: code review of 1-2-design-tokens-and-typography-system (2026-04-03)

- h4/h5/h6 have no explicit font-size — after Tailwind preflight reset they render at body text size. The UX type scale only defines 7 levels (none for h4-h6). Add sizes when content actually uses these heading levels.
- `text-text-primary` utility class is awkward due to `--color-text-primary` token naming. Functional but confusing. Consider renaming to `--color-foreground` or `--color-body` in a future token revision.

## Deferred from: code review of 1-3-base-layout-and-accessibility-foundations (2026-04-03)

- The 1200px `max-w` container in BaseLayout wraps `<main>`. Future full-bleed components (HeroChapter, POVSection full-width backgrounds) will need a breakout pattern (e.g. `w-screen -mx` or restructuring). Address when implementing stories 2.1/2.2.

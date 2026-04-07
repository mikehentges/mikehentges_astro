# Deferred Work

## Deferred from: code review of 1-1-project-initialization-and-toolchain (2026-04-02)

- No `404.astro` page — old catch-all route deleted, default Astro 404 will show for any unmatched URL. Consider adding a branded 404 page in a future story.
- No redirects for old URL structure — posts moved from `/<slug>` to `/blog/<slug>`, all external links and SEO break. Address in Story 3.4 (content migration) or Story 1.6 (deployment config).
- `/favicon.ico` requests will 404 — `favicon.svg` exists and works for modern browsers, but some tools/browsers still request `.ico` by convention. Consider adding a favicon.ico or redirect.

## Deferred from: code review of 1-2-design-tokens-and-typography-system (2026-04-03)

- h4/h5/h6 have no explicit font-size — after Tailwind preflight reset they render at body text size. The UX type scale only defines 7 levels (none for h4-h6). Add sizes when content actually uses these heading levels.
- `text-text-primary` utility class is awkward due to `--color-text-primary` token naming. Functional but confusing. Consider renaming to `--color-foreground` or `--color-body` in a future token revision.

## Deferred from: code review of 1-3-base-layout-and-accessibility-foundations (2026-04-03)

- ~~The 1200px `max-w` container in BaseLayout wraps `<main>`. Future full-bleed components (HeroChapter, POVSection full-width backgrounds) will need a breakout pattern.~~ **RESOLVED in Epic 2:** POVSection uses `width: 100vw; margin-left: calc(50% - 50vw)` breakout; other sections defer to BaseLayout's container. Body has `overflow-x: hidden`.

## Deferred from: code review of 1-5-footer-and-link-hierarchy (2026-04-04)

- Custom link styles (`.link-cta`, `.link-text`, prose inline links) use CSS `background-color` and `border-bottom` which are stripped in Windows High Contrast / Forced Colors Mode. Native `text-decoration` is preserved but custom borders are not. Consider adding `@media (forced-colors: active)` fallbacks when the design system matures or accessibility audit is performed.

## Deferred from: code review of 1-6-cloudflare-pages-deployment (2026-04-04)

- No `Content-Security-Policy` header — the static site is a good candidate for a tight CSP (e.g., `default-src 'self'`). Add when the full asset pipeline (images, fonts, inline styles) is finalized to avoid false blocks during development.
- No `Permissions-Policy` header — consider adding `camera=(), microphone=(), geolocation=()` as standard hardening once the site is feature-complete.

## Deferred from: code review of 3-1-content-collection-and-schema (2026-04-05)

- Content collection schema uses `z.string()` for title and summary which allows empty strings. Consider adding `.min(1)` if empty frontmatter fields become an authoring problem.
- No `draft` field in the content schema — no way to hide work-in-progress posts from being published. Add if needed when content workflow matures.

## Deferred from: code review of 3-2-blog-post-page-with-authorbio (2026-04-05)

- Hero image alt text is generic (`Hero image for {title}`). Consider adding a `heroAlt` field to the content schema for meaningful image descriptions per WCAG best practices.

## Deferred from: code review of 4-1-about-page (2026-04-05)

- No `<meta name="description">` or Open Graph tags on the About page — BaseLayout currently has no SEO metadata props. Will be addressed in Epic 5 (Story 5-1: SEOHead component).

## Deferred from: code review of 5-1-seohead-component-and-sitemap-configuration (2026-04-06)

- `ogImage` path handling in SEOHead assumes relative paths start with `/`. If a caller passes a relative path without leading slash (e.g., `images/og.jpg`), the URL is malformed. No current callers affected.
- `canonicalUrl` prop accepted by SEOHead but not forwarded through BaseLayout's Props interface. Pages cannot override canonical URL through the layout. No current need for overrides.

---
title: 'Cloudflare Pages Deployment'
type: 'chore'
created: '2026-04-04'
status: 'done'
baseline_commit: 'dd9d85b'
context:
  - '_bmad-output/planning-artifacts/architecture.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The site has no deployment pipeline — there's no way to go from `git push` to live production. The site builds locally but has no Cloudflare Pages configuration, no CI workflow, and no deployment-related static files (`_headers`, `_redirects`).

**Approach:** Add the minimal Cloudflare Pages configuration files and a `_headers` file for security/caching. Cloudflare Pages project creation and DNS are done in the Cloudflare dashboard (outside this spec). The code changes make the repo deployment-ready so that connecting it to Cloudflare Pages "just works."

## Boundaries & Constraints

**Always:**
- `output: 'static'` — no SSR, no `@astrojs/cloudflare` adapter
- Node 22 build environment (already pinned in `.nvmrc`)
- Build command: `pnpm install && pnpm build`, output directory: `dist/`
- Security headers on all responses (X-Content-Type-Options, X-Frame-Options, Referrer-Policy)
- Cache immutable hashed assets (`_astro/*`) with long TTL

**Ask First:**
- Any changes to `astro.config.ts`
- Adding redirects for old URL paths (deferred from Story 1-1 review — may belong in Story 3-4 instead)

**Never:**
- Install `@astrojs/cloudflare` adapter or wrangler as a project dependency
- Add GitHub Actions CI (Cloudflare Pages has its own git-triggered builds)
- Configure custom domains or DNS (dashboard-only concern)

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Production push | Push to `main` | Cloudflare builds with `pnpm build`, deploys `dist/` | Build failure shown in CF dashboard |
| Preview build | Push to non-main branch or PR | Preview URL generated automatically | Same as above |
| 404 route | Visit `/nonexistent` | Returns 404 (Astro default or custom if added) | N/A |
| Hashed asset request | `GET /_astro/style.abc123.css` | Served with `Cache-Control: public, max-age=31536000, immutable` | N/A |

</frozen-after-approval>

## Code Map

- `public/_headers` -- Cloudflare Pages headers file: security headers + asset caching rules
- `public/_redirects` -- Cloudflare Pages redirects file: placeholder for future URL migration (Story 3-4)
- `wrangler.toml` -- Cloudflare Pages project config: build command, output dir, compatibility date, Node version

## Tasks & Acceptance

**Execution:**
- [x] `wrangler.toml` -- Create Cloudflare Pages project configuration specifying build command (`pnpm install && pnpm build`), output directory (`dist/`), compatibility date, and Node 22 environment variable
- [x] `public/_headers` -- Create headers file with security headers on all routes (`/*`) and immutable cache on hashed assets (`/_astro/*`)
- [x] Verify -- Run `pnpm build` succeeds and `dist/` contains all 5 routes

**Acceptance Criteria:**
- Given the repo is connected to Cloudflare Pages, when code is pushed to `main`, then Cloudflare Pages builds and deploys using the `wrangler.toml` configuration
- Given a successful deployment, when visiting any of the 5 routes (/, /blog, /about, /contact, /blog/[slug]), then pages render correctly
- Given a request for `/_astro/*`, when the response is served, then the `Cache-Control` header includes `immutable` with a 1-year max-age
- Given any page request, when the response is served, then security headers (`X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`) are present

## Verification

**Commands:**
- `pnpm build` -- expected: exits 0, `dist/` contains `index.html`, `about/index.html`, `blog/index.html`, `contact/index.html`

**Manual checks (if no CLI):**
- After connecting to Cloudflare Pages: push to `main`, verify all 5 routes load; check response headers in browser DevTools

## Suggested Review Order

- Cloudflare Pages project config: name, compatibility date, output dir
  [`wrangler.toml:1`](../../wrangler.toml#L1)

- Security headers (nosniff, DENY, referrer) on all routes + immutable asset caching
  [`_headers:1`](../../public/_headers#L1)

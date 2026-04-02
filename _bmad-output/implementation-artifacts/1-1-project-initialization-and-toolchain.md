# Story 1.1: Project Initialization & Toolchain

Status: done

## Story

As a developer,
I want a fully configured Astro 6 project with all integrations and tooling in place,
so that all subsequent development has a consistent, working foundation.

## Acceptance Criteria

1. **AC1 — Astro 6 minimal template initialized**
   - Project builds and runs on `localhost:4321`
   - `@tailwindcss/vite` plugin is installed and configured
   - `@astrojs/sitemap` integration is installed and configured
   - TypeScript strict mode is enabled in `tsconfig.json`
   - Prettier is configured with tabWidth: 2
   - Node 22+ is specified as the runtime requirement

2. **AC2 — Directory structure and placeholder routes**
   - `src/components/`, `src/layouts/`, `src/pages/`, `src/pages/blog/`, `src/content/posts/`, `src/styles/` directories exist
   - Placeholder pages exist for all 5 routes: `/` (index.astro), `/blog` (blog/index.astro), `/blog/[slug]` (blog/[slug].astro), `/about` (about.astro), `/contact` (contact.astro)
   - Each placeholder page renders a basic heading identifying the route
   - `pnpm dev` serves all 5 routes without errors

3. **AC3 — Astro Fonts API configured**
   - Sora, Satoshi, and JetBrains Mono are configured via Astro 6 Fonts API in `astro.config.ts`
   - No external CDN font requests at runtime — all fonts self-hosted

4. **AC4 — Global CSS foundation**
   - `src/styles/global.css` imports Tailwind CSS (`@import "tailwindcss"`)
   - Font-face declarations reference Astro Fonts API CSS variables
   - File is imported in BaseLayout

## Tasks / Subtasks

- [x] **Task 1: Fresh Astro 6 project initialization** (AC: 1)
  - [x] 1.1 — Remove all existing `src/` files, old config files (`astro.config.mjs`, old `package.json` deps, `src/styles/*.scss`, old components, old pages, old content config)
  - [x] 1.2 — Run `npm create astro@latest -- --template minimal` in a temp directory, then copy the scaffold into the project root (preserving `.git/`, `_bmad/`, `_bmad-output/`, `CLAUDE.md`)
  - [x] 1.3 — Switch package manager to pnpm: run `pnpm install`
  - [x] 1.4 — Verify `pnpm dev` starts the dev server on `localhost:4321`

- [x] **Task 2: Install integrations** (AC: 1)
  - [x] 2.1 — Run `pnpm astro add tailwind` — this installs `@tailwindcss/vite` (NOT the deprecated `@astrojs/tailwind`)
  - [x] 2.2 — Run `pnpm astro add sitemap` — installs `@astrojs/sitemap`
  - [x] 2.3 — Set `site: 'https://hentges.ai'` in `astro.config.ts` (required by sitemap)
  - [x] 2.4 — Set `output: 'static'` in `astro.config.ts` (explicit static mode — NO Cloudflare adapter needed for static sites)

- [x] **Task 3: Configure TypeScript and Prettier** (AC: 1)
  - [x] 3.1 — Verify `tsconfig.json` extends `"astro/tsconfigs/strict"`
  - [x] 3.2 — Create `.prettierrc` with `{ "tabWidth": 2 }`
  - [x] 3.3 — Add `.nvmrc` or `engines` field in `package.json` specifying Node 22+

- [x] **Task 4: Configure Astro Fonts API** (AC: 3)
  - [x] 4.1 — Add fonts configuration to `astro.config.ts`:
    - Sora (Google Fonts provider) → `--font-sora`
    - Satoshi (Fontshare provider) → `--font-satoshi`
    - JetBrains Mono (Google Fonts provider) → `--font-mono`
  - [x] 4.2 — Verify font CSS variables are available in components

- [x] **Task 5: Create directory structure** (AC: 2)
  - [x] 5.1 — Create directories: `src/components/`, `src/layouts/`, `src/pages/blog/`, `src/content/posts/`, `src/styles/`
  - [x] 5.2 — Create `src/styles/global.css` with `@import "tailwindcss"` and font-family assignments using CSS variables from Fonts API

- [x] **Task 6: Create BaseLayout stub** (AC: 4)
  - [x] 6.1 — Create `src/layouts/BaseLayout.astro` with HTML shell: `<html lang="en">`, `<head>` with charset/viewport, `<body>`, `<main>` landmark, slot for page content
  - [x] 6.2 — Import `global.css` in BaseLayout

- [x] **Task 7: Create placeholder pages for all 5 routes** (AC: 2)
  - [x] 7.1 — `src/pages/index.astro` → renders `<h1>Home</h1>` using BaseLayout
  - [x] 7.2 — `src/pages/blog/index.astro` → renders `<h1>Blog</h1>` using BaseLayout
  - [x] 7.3 — `src/pages/blog/[slug].astro` → renders `<h1>Blog Post: {slug}</h1>` using BaseLayout with `getStaticPaths()` stub
  - [x] 7.4 — `src/pages/about.astro` → renders `<h1>About</h1>` using BaseLayout
  - [x] 7.5 — `src/pages/contact.astro` → renders `<h1>Contact</h1>` using BaseLayout

- [x] **Task 8: Verify build and dev server** (AC: 1, 2)
  - [x] 8.1 — Run `pnpm dev` and verify all 5 routes respond
  - [x] 8.2 — Run `pnpm build` and verify it completes without errors

## Dev Notes

### Brownfield Context — CRITICAL

This is a **rewrite on the `rewrite` branch** of an existing Astro 4.5 project. The current codebase has:
- `astro.config.mjs` (empty config) — will be replaced by `astro.config.ts`
- `package.json` with Astro 4.5.12, sass 1.72, @astrojs/check 0.5.10
- SCSS-based styling system (`src/styles/*.scss`) — being replaced by Tailwind v4
- Old components: `Header.astro`, `Footer.astro`
- Old layouts: `BaseLayout.astro`, `PageLayout.astro`
- Old pages: `[...slug].astro`, `[category].astro`, `about.markdown`, `index.astro`
- Old content collection config at `src/content/config.ts` — moves to `content.config.ts` in Astro 6
- Existing blog posts in `src/content/posts/` (flat .md files, not co-located) — these are handled in Story 3.4, NOT this story

**Preserve during init:** `.git/`, `_bmad/`, `_bmad-output/`, `CLAUDE.md`, `.claude/`, `public/robots.txt`, `public/favicon.svg`

**Delete during init:** All `src/` contents, old `astro.config.mjs`, old `package.json` dependencies (rebuild from scratch), all SCSS files

### Architecture Compliance

| Rule | Requirement |
|------|-------------|
| Components | Flat `src/components/` — no subdirectories |
| Pages | kebab-case per Astro convention |
| Config files | kebab-case |
| Styling | Tailwind utility classes only — **no `@apply`**, no SCSS |
| Colors | **Never** use raw hex values — always Tailwind theme tokens (tokens defined in Story 1.2, not this story) |
| Images | Always use Astro `<Image>` — never raw `<img>` |
| TypeScript | Strict mode |
| Formatting | Prettier, tabWidth: 2 |

### Tailwind v4 — Key Differences from v3

- **No `tailwind.config.ts`** — Tailwind v4 uses CSS-based configuration via `@theme` blocks in CSS files
- The architecture doc's project structure shows `tailwind.config.ts` — this file does NOT exist in Tw v4. Design tokens will be defined via `@theme` in `global.css` in Story 1.2
- Integration is via `@tailwindcss/vite` plugin, NOT the deprecated `@astrojs/tailwind`
- CSS entry point uses `@import "tailwindcss"` instead of `@tailwind base/components/utilities` directives

### Cloudflare Deployment — Static Site Decision

The architecture says to install `@astrojs/cloudflare` adapter. However:
- `@astrojs/cloudflare` v13+ is for **Workers/SSR only** — it dropped Cloudflare Pages support
- This is a **fully static site** (`output: 'static'`) — no SSR needed
- Cloudflare Pages deploys static sites by serving the `dist/` folder directly — no adapter required
- **Do NOT install `@astrojs/cloudflare`** — it's unnecessary and would add complexity for a static build
- Deployment config (wrangler.toml or Cloudflare dashboard) is handled in Story 1.6

### Astro 6 Content Collections — Migration Note

Content collection config location changed in Astro 6:
- **Old (Astro 4):** `src/content/config.ts`
- **New (Astro 6):** `content.config.ts` at project root
- Collections now require explicit loaders (e.g., `glob()`)
- The content schema and collection setup is handled in **Story 3.1**, not this story
- For this story: just create the `src/content/posts/` directory as an empty placeholder

### Astro Fonts API (Astro 6)

Built into Astro 6 — no external packages needed. Configuration goes in `astro.config.ts`:
```ts
import { defineConfig, fontProviders } from 'astro/config';

export default defineConfig({
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Sora',
      cssVariable: '--font-sora',
    },
    {
      provider: fontProviders.fontsource(),
      name: 'Satoshi',
      cssVariable: '--font-satoshi',
    },
    {
      provider: fontProviders.google(),
      name: 'JetBrains Mono',
      cssVariable: '--font-mono',
    },
  ],
});
```
Fonts are downloaded at build time and served as local files — zero external CDN requests at runtime.

### What This Story Does NOT Do

- Does NOT define design tokens/colors (Story 1.2)
- Does NOT create the full type scale (Story 1.2)
- Does NOT build StickyNav or Footer (Stories 1.4, 1.5)
- Does NOT set up content collection schema (Story 3.1)
- Does NOT migrate existing posts (Story 3.4)
- Does NOT configure Cloudflare deployment (Story 1.6)
- Does NOT add SEO metadata (Story 5.1)

### Project Structure After This Story

```
mikehentges_astro/
├── astro.config.ts          # Astro 6 config: sitemap, fonts, static output
├── tsconfig.json            # extends astro/tsconfigs/strict
├── package.json             # Astro 6, @tailwindcss/vite, @astrojs/sitemap, pnpm
├── .prettierrc              # { "tabWidth": 2 }
├── .nvmrc                   # 22
├── public/
│   ├── robots.txt           # (preserved from existing)
│   └── favicon.svg          # (preserved from existing)
├── src/
│   ├── components/          # Empty (populated in later stories)
│   ├── layouts/
│   │   └── BaseLayout.astro # HTML shell with global.css import
│   ├── pages/
│   │   ├── index.astro      # Placeholder: <h1>Home</h1>
│   │   ├── about.astro      # Placeholder: <h1>About</h1>
│   │   ├── contact.astro    # Placeholder: <h1>Contact</h1>
│   │   └── blog/
│   │       ├── index.astro  # Placeholder: <h1>Blog</h1>
│   │       └── [slug].astro # Placeholder with getStaticPaths stub
│   ├── content/
│   │   └── posts/           # Empty (content added in Story 3.1+)
│   └── styles/
│       └── global.css       # @import "tailwindcss", font-family setup
├── _bmad/                   # (preserved)
├── _bmad-output/            # (preserved)
├── .claude/                 # (preserved)
└── CLAUDE.md                # (preserved)
```

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 1.1]
- [Source: _bmad-output/planning-artifacts/architecture.md#Starter Template]
- [Source: _bmad-output/planning-artifacts/architecture.md#Project Structure]
- [Source: _bmad-output/planning-artifacts/architecture.md#Implementation Patterns]
- [Source: _bmad-output/planning-artifacts/prd.md#Technical Stack]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Typography System]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (1M context)

### Debug Log References

- Satoshi font: story specified `fontProviders.fontsource()` but Satoshi is not on Fontsource — it's on Fontshare. Fixed to `fontProviders.fontshare()`.
- `@astrojs/check` and `typescript` auto-installed by `astro check` during first build.

### Completion Notes List

- Removed all old Astro 4 src/ files, astro.config.mjs, .prettierrc.json
- Scaffolded fresh Astro 6 project from `minimal` template
- Installed `@tailwindcss/vite` + `tailwindcss` v4.2.2 via `pnpm astro add tailwind`
- Installed `@astrojs/sitemap` v3.7.2 via `pnpm astro add sitemap`
- Configured `astro.config.ts`: site URL, static output, Tailwind vite plugin, sitemap integration, Fonts API (Sora, Satoshi, JetBrains Mono)
- tsconfig.json: extends `astro/tsconfigs/strict`
- Created `.prettierrc` (tabWidth: 2), `.nvmrc` (22), `engines` in package.json (>=22.0.0)
- Created global.css with Tailwind import and font-family assignments
- Created BaseLayout.astro with HTML shell, meta tags, global.css import, slot
- Created 5 placeholder pages: index, blog/index, blog/[slug], about, contact — all using BaseLayout
- All 5 routes return HTTP 200 on dev server
- Production build succeeds: 5 pages built, 5 font files self-hosted, sitemap generated

### Change Log

- 2026-04-02: Story 1.1 implemented — full Astro 6 project initialization with Tailwind v4, sitemap, fonts, placeholder routes

### File List

- astro.config.ts (new — replaces old astro.config.mjs)
- tsconfig.json (modified — updated includes/excludes for Astro 6)
- package.json (modified — Astro 6 deps, engines field, pnpm config)
- pnpm-lock.yaml (new — regenerated for Astro 6)
- .prettierrc (new — replaces old .prettierrc.json)
- .nvmrc (new)
- .gitignore (modified — updated from Astro 6 scaffold)
- src/styles/global.css (new)
- src/layouts/BaseLayout.astro (new)
- src/pages/index.astro (new)
- src/pages/about.astro (new)
- src/pages/contact.astro (new)
- src/pages/blog/index.astro (new)
- src/pages/blog/[slug].astro (new)
- src/content/posts/ (new directory — empty placeholder)
- src/components/ (new directory — empty placeholder)

### Review Findings

- [x] [Review][Patch] `.gitignore` dropped `.vscode/` — only `.idea/` listed, both IDE dirs should be ignored [.gitignore] — FIXED
- [x] [Review][Patch] `pnpm-workspace.yaml` malformed and unnecessary — `onlyBuiltDependencies` is a string not a list, config already in package.json, file not in spec; remove it [pnpm-workspace.yaml] — FIXED (removed)
- [x] [Review][Patch] `CLAUDE.md` references stale SCSS architecture — still describes `_variables.scss`, `_monokai.scss`, SCSS system, old routing; update to reflect Tailwind v4 + Astro 6 [CLAUDE.md] — FIXED
- [x] [Review][Patch] `robots.txt` missing `Sitemap:` directive — sitemap integration generates `sitemap-index.xml` but robots.txt has no pointer [public/robots.txt] — FIXED
- [x] [Review][Patch] `prettier-plugin-astro` not installed — AC1 says Prettier configured but formatter tooling missing from dependencies [package.json] — FIXED (prettier + prettier-plugin-astro added to devDependencies)
- [x] [Review][Defer] No `404.astro` page — old catch-all deleted, no custom error page; not in this story's scope — deferred, pre-existing
- [x] [Review][Defer] No redirects for old URL structure — posts moved from `/<slug>` to `/blog/<slug>`; handled in Story 3.4 or 1.6 — deferred, pre-existing
- [x] [Review][Defer] `/favicon.ico` requests will 404 — `favicon.svg` works but browsers may still request `.ico` — deferred, pre-existing

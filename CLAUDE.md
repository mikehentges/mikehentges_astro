# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

- **Package manager:** pnpm
- **Dev server:** `pnpm dev` (runs on localhost:4321)
- **Build:** `pnpm build` (runs `astro check` then `astro build`, outputs to `dist/`)
- **Preview built site:** `pnpm preview`
- **Type check only:** `npx astro check`

## Architecture

This is a personal blog/portfolio site (Hentges.AI) built with **Astro 6** as a fully static site. No JS frameworks — Astro components only.

### Content System
- Blog posts will live in `src/content/posts/` as Markdown files with YAML frontmatter
- Content collection schema will be defined in `content.config.ts` (Astro 6 convention) using Zod
- Currently in scaffolding phase — content system setup is a future story

### Routing
- `src/pages/index.astro` — Home page (placeholder)
- `src/pages/blog/index.astro` — Blog listing (placeholder)
- `src/pages/blog/[slug].astro` — Individual blog posts (placeholder with `getStaticPaths()` stub)
- `src/pages/about.astro` — About page (placeholder)
- `src/pages/contact.astro` — Contact page (placeholder)

### Styling
- **Tailwind CSS v4** via `@tailwindcss/vite` plugin — CSS-first configuration, no `tailwind.config.ts`
- `src/styles/global.css` imports Tailwind and sets font-family assignments
- Design tokens will be defined via `@theme` blocks in `global.css` (future story)
- No SCSS — Tailwind utility classes only, no `@apply`
- Prettier configured with tabWidth: 2

### Fonts
- **Sora** (headings) — Google Fonts via Astro Fonts API
- **Satoshi** (body) — Fontshare via Astro Fonts API
- **JetBrains Mono** (code) — Google Fonts via Astro Fonts API
- All fonts downloaded at build time and self-hosted — zero external CDN requests

### Layouts
- `BaseLayout.astro` — Root HTML wrapper with `<html>`, `<head>`, `<body>`, `<main>` landmark, imports `global.css`

### Deployment
- Static site targeting Cloudflare Pages (deployment config is a future story)
- `output: 'static'` — no SSR, no Cloudflare adapter needed
- No server-side rendering or API routes

### Git
- do not automatically commit changes to Git, or perform any other destructive git command. User will handle all changes to the git repository. You may add files, but no commits or PRs.

DISTILLED_AESTHETICS_PROMPT = """
<frontend_aesthetics>
You tend to converge toward generic, "on distribution" outputs. In frontend design, this creates what users call the "AI slop" aesthetic. Avoid this: make creative, distinctive frontends that surprise and delight. Focus on:

Typography: Choose fonts that are beautiful, unique, and interesting. Avoid generic fonts like Arial and Inter; opt instead for distinctive choices that elevate the frontend's aesthetics.

Color & Theme: Commit to a cohesive aesthetic. Use CSS variables for consistency. Dominant colors with sharp accents outperform timid, evenly-distributed palettes. Draw from IDE themes and cultural aesthetics for inspiration.

Motion: Use animations for effects and micro-interactions. Prioritize CSS-only solutions for HTML. Use Motion library for React when available. Focus on high-impact moments: one well-orchestrated page load with staggered reveals (animation-delay) creates more delight than scattered micro-interactions.

Backgrounds: Create atmosphere and depth rather than defaulting to solid colors. Layer CSS gradients, use geometric patterns, or add contextual effects that match the overall aesthetic.

Avoid generic AI-generated aesthetics:
- Overused font families (Inter, Roboto, Arial, system fonts)
- Clichéd color schemes (particularly purple gradients on white backgrounds)
- Predictable layouts and component patterns
- Cookie-cutter design that lacks context-specific character

Interpret creatively and make unexpected choices that feel genuinely designed for the context. Vary between light and dark themes, different fonts, different aesthetics. You still tend to converge on common choices (Space Grotesk, for example) across generations. Avoid this: it is critical that you think outside the box!
</frontend_aesthetics>
"""
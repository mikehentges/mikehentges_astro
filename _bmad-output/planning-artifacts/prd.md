---
classification:
  projectType: "web_app"
  domain: "general"
  complexity: "low"
  projectContext: "brownfield"
inputDocuments:
  - "product-brief-mikehentges_astro.md"
  - "brainstorming-session-2026-03-31-001.md"
trimmedFrom: "original PRD (2026-04-01) — reduced after adversarial review"
---

# Product Requirements Document — Hentges.AI

**Author:** Mike Hentges
**Date:** 2026-04-01 (revised 2026-04-02)

## Executive Summary

Hentges.AI is a professional consulting web presence — a credibility platform that validates warm prospects' existing positive impressions rather than generating cold leads. Prospects arrive via LinkedIn posts, shared articles, and referrals already leaning in; the site's job is to confirm "this person is as credible as their ideas suggest" and make it easy to reach out.

The current site is a personal hobby blog (technology, chess, woodworking) with no business positioning. It undermines credibility for a consultant with 20+ years as CTO of a Fortune 500 systems integrator, 3 years as IT Director at a mid-sized manufacturer, and deep applied AI expertise.

The rewrite delivers a narrative-led, five-route static site (Home, Blog, Blog Post, About, Contact) built on Astro with Tailwind CSS v4, deployed to Cloudflare Pages. It leads with client empowerment, demonstrates expertise through opinionated thought leadership content, and positions the consulting worldview: *AI is an accelerator, not a shortcut — and you still need someone who knows how to build the right thing, the right way, for your situation.*

## How the Site Works

Warm prospects (referred VPs, SI CTOs) confirm credibility and find contact info. Cold searchers find a good blog post and discover who wrote it. In both cases, the site needs to not fumble the handoff — clear identity, good writing, easy path to contact. The content author (Mike) publishes by adding a Markdown file and pushing to git.

## Scope

### What to Build

- Complete visual redesign with professional typography, color system, and layout — the site should look polished and intentional, not templated
- Five-route architecture: Home (/), Blog (/blog), Blog Post (/blog/[slug]), About (/about), Contact (/contact)
- **Homepage:** Empowerment-led hero, POV block, career proof points, recent posts, how I work, CTA
- **About:** Three career threads (enterprise systems builder, manufacturing operations leader, AI practitioner) woven into a cohesive narrative
- **Contact:** Direct email (mailto), LinkedIn link, soft engagement signal — no forms
- **Blog listing and posts** with author bio block on every post
- Content migration: existing tech/AI posts carried over; chess, woodworking, and hobby content retired entirely
- Astro (latest) + Tailwind CSS v4 component architecture
- Cloudflare Pages deployment (preview builds, auto-deploy on push)
- SEO fundamentals: meta tags, Open Graph/Twitter Card, JSON-LD structured data, sitemap, canonical URLs
- LinkedIn follow CTA on blog posts and contact page
- Mobile-responsive across all breakpoints
- 1-2 new blog posts at launch

### What NOT to Build

- Newsletter signup
- Productized offering pages
- Related post recommendations
- Advanced analytics beyond Cloudflare built-in
- Contact form of any kind

### Content Migration

- **Migrate:** Tech/AI posts from `src/content/posts/` — frontmatter updates to match new schema, content body as-is
- **Retire:** Chess, woodworking, and other hobby content — removed entirely, no redirects
- **New:** 1-2 posts reinforcing brand themes at launch

### Open Questions

- **Image hosting:** Current site uses Cloudinary CDN for image resizing. Astro's built-in image optimization (`astro:assets` / Sharp) may be simpler — handles resizing, format conversion, and lazy loading at build time without the external dependency. Evaluate during implementation.

## Design Decisions

These capture the non-obvious choices. The obvious stuff (nav bar works, Markdown renders, pages are responsive) doesn't need to be specified.

1. **Narrative-led, not service-catalog:** No audience lanes, no service boxes. The site says "here's how I think" and lets visitors self-qualify.
2. **Homepage leads with empowerment, not credentials:** First viewport answers "what can you do for me?" before "who are you?"
3. **Author bio block on every blog post:** Blog posts are the most common entry point. Every post must establish who wrote it and that consulting is available.
4. **Direct email, no form:** A mailto link says "you're talking to a person." A form says "sales funnel." This is deliberate.
5. **Tailwind v4 over existing SCSS:** Mike's background is backend development. Tailwind is more maintainable long-term for someone who isn't a CSS specialist, and the Tailwind Plus account provides component access.
6. **Cloudflare Pages over GitHub Pages:** Mike already uses Cloudflare for other projects. Preview deployments and built-in analytics are useful. Consolidation, not migration for its own sake.
7. **Blog content is broad:** AI, development practices, technology trends — unified by voice, not by topic. Demonstrates range and curiosity.

## Technical Stack

- **Framework:** Astro (latest) — static MPA, pre-rendered HTML, no client-side JS frameworks
- **Styling:** Tailwind CSS v4 with component architecture encapsulating utility classes
- **Content:** Markdown with Zod-validated frontmatter (content collections)
- **Deployment:** Cloudflare Pages — auto-deploy on push to main
- **Browsers:** Modern evergreen only (Chrome, Firefox, Safari, Edge — latest 2 versions)

## Quality Targets

| Target | Threshold |
|--------|-----------|
| Lighthouse Performance | >95 |
| New post → live on production | <30 minutes (just a Markdown file + git push) |
| Homepage page weight | <500KB including all assets |
| Build time | <60 seconds |

The site must look and feel *finished* at launch. A half-designed credibility platform undermines its entire purpose.

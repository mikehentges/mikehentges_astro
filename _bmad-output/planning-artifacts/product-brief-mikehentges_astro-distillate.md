---
title: "Product Brief Distillate: mikehentges_astro"
type: llm-distillate
source: "product-brief-mikehentges_astro.md"
created: "2026-04-01"
purpose: "Token-efficient context for downstream PRD creation"
---

# Product Brief Distillate: Hentges.AI

## Rejected Ideas

- **Nuxt 4 / Vue / NuxtUI migration** — Evaluated during brainstorming as potential stack refresh. Rejected: design problem, not a stack problem. Astro is the consensus best framework for content-heavy static sites. User later reopened stack discussion but web research confirmed Astro remains the right choice.
- **Next.js / SvelteKit** — Evaluated during web research. Both overkill for a content site; unnecessary complexity and bundle size.
- **Services page / industry verticals** — Rejected: Mike is a boundary-crosser, not a category specialist. Service catalogs make a solo practice look like a small firm pretending to be big. POV and blog do this work instead.
- **Portfolio / case studies page** — Rejected: case narratives live in blog posts. Dedicated portfolio creates maintenance burden and risks NDA issues with prior Fortune 500 SI work.
- **Contact form / lead capture** — Rejected by design. Forms signal "sales funnel." Direct email signals "talking to a person." Matches experienced-guide positioning.
- **Audience-specific landing pages or lanes** — Rejected: trying to speak to three distinct personas dilutes messaging. Unified voice for technology leaders, not segmented funnels.
- **Newsletter at launch** — Deferred: consider post-launch if blog cadence proves sustainable. LinkedIn follow CTA covers low-friction "stay connected" for now.
- **Chess/woodworking content preservation** — Rejected: clean break to business-focused identity. No redirects, content retired entirely.
- **Advanced analytics (GA, Plausible, etc.)** — Out of scope: Cloudflare built-in metrics sufficient for lifestyle practice. Revisit only if diagnostic needs arise.
- **Semi-retirement as explicit positioning ("I only take 2-3 engagements")** — Not explicitly decided. Opportunity reviewer flagged selectivity as premium signal. User did not adopt but didn't reject — open for PRD/UX phase.

## Requirements Hints

- **Tailwind CSS v4 with component architecture** — User has Tailwind Plus account. Components should encapsulate Tailwind's HTML-heavy utility classes to keep templates clean.
- **Cloudflare Pages deployment** — User chose this over GitHub Pages. Free tier, faster global CDN, preview deployments, built-in analytics.
- **Cloudinary CDN for images** — Already in use, no change needed. All post hero images hosted externally.
- **Markdown content collections** — Existing Astro content system (posts in `src/content/posts/` with YAML frontmatter). Schema: title, date, hero, categories, summary, attrib (optional). Defined in `src/content/config.ts` using Zod.
- **No JavaScript frameworks** — Astro components only, static generation. Islands architecture available if selective interactivity needed later.
- **SEO fundamentals required at launch** — Meta tags, structured data (JSON-LD), sitemap, robots.txt (already exists).
- **LinkedIn follow CTA** — On blog posts and contact page as low-friction engagement capture.
- **Contact page engagement signal** — "I take on a small number of advisory and project engagements — no long-term staff augmentation."
- **Homepage must work for skimmers** — First viewport delivers clear "who I am, what I do, who I do it for" before deeper narrative unfolds.
- **Blog post routing change** — Current: `/[...slug].astro` (catch-all). New: `/blog/[slug]` (explicit blog prefix).
- **Category routing change** — Current: `/[category].astro` (dynamic). New: categories likely handled within `/blog` route, not top-level.

## Technical Context

- **Current stack**: Astro 4.5.12, SASS 1.72.0, TypeScript 5.4.3, GitHub Pages
- **Target stack**: Astro (latest), Tailwind CSS v4 (replacing SCSS), TypeScript, Cloudflare Pages
- **Current design tokens**: #120fd7 primary (blue), #6DB79F title (teal), system fonts + Georgia serif — all being replaced
- **Current components**: minimal — Header, Footer, BaseLayout, PageLayout only. No component library.
- **Current routing**: index.astro (home), [category].astro (filter), [...slug].astro (posts), about.markdown
- **Target routing**: / (home), /blog (listing), /blog/[slug] (posts), /about, /contact
- **Design direction**: "Confident, editorial, slightly irreverent — closer to a respected CTO's Substack than a consulting firm's brochure." Professional without corporate. Craft and restraint, not template.
- **CLAUDE.md has aesthetic guidance**: Warns against generic AI aesthetics (Inter, purple gradients, predictable layouts). Requires distinctive typography, committed color strategy, purposeful motion.

## Detailed User Scenarios

- **VP Googles Mike after a referral**: Lands on homepage, skims first viewport for credibility check ("does this person understand my world?"), reads POV block, clicks about page for career depth, sends email. Total time on site: 2-3 minutes. The site needs to pass the "credibility check" in seconds.
- **SI CTO clicks LinkedIn post link**: Lands on a blog post, reads it, thinks "this person has actually operated at my level." Browses 1-2 more posts, visits about page, bookmarks the site. May not reach out for months. LinkedIn follow CTA captures this mid-funnel interest.
- **Prospect re-visits before reaching out**: Returns to site they bookmarked weeks ago. Needs to quickly re-confirm credibility and find the contact info. Contact page must be immediately accessible and clear about engagement model.

## Competitive Intelligence

- **Big 4 / MBB (McKinsey, BCG, Deloitte, Accenture)**: Enterprise-scale AI programs, $200K+ entry point. Overkill for mid-market. Junior staff on mid-market accounts. Not a direct competitor but sets buyer expectations.
- **Mid-tier tech consultancies (Slalom, Avanade, Cognizant)**: Blended strategy + implementation. Talent stretched thin, vendor-locked recommendations. Mid-market clients often get junior staff.
- **Boutique AI firms (RTS Labs, Superside AI, CT Labs)**: $50K-$150K focused engagements. Many lack deep operational/enterprise infrastructure experience. Heavy data science, light business transformation.
- **Solo AI consultants / fractional CTOs**: $100-$300/hr, retainer models, personal brand-driven. Inconsistent professionalism — weak web presence, vague positioning. This is the peer set and where Hentges.AI differentiates most clearly.
- **Contact center AI vendors (Five9, NICE, Genesys)**: Consulting wrapped around product sales. Vendor bias. Not independent advisory.
- **Key differentiator vs all**: Mike has operated (CTO P&L, team building, Fortune 500 delivery) — not just advised. Most competitors are either pure strategists or pure implementers. The boundary-crossing pattern is authentic and hard to replicate.
- **Domain specialists command 30-40% fee premiums** over generalists. CTO + contact center + manufacturing is a rare combination.

## Market Context

- AI consulting ~$11B (2025), projected $30B+ by 2028, 20-26% CAGR
- Mid-market/SMB segment growing fastest at 25.7% CAGR — the land-grab opportunity
- Only 15-25% of enterprises successfully scale AI despite 63% planning to increase investment — the execution gap is the consulting opportunity
- Companies doubling AI spend from 0.8% to 1.7% of revenue in 2026
- AI governance emerging as non-negotiable (EU AI Act enforcement, US state laws)
- Independent consulting market grew from $27.4B (2019) to $43.8B (2024) — buyers comfortable hiring independents
- Trust is the primary buying signal — prospects evaluate personal credibility before evaluating the firm
- Growing skepticism toward AI hype — pragmatic "accelerator not shortcut" framing resonates

## Open Questions

- **Engagement model detail**: User is flexible but avoids long-term staff aug. Specific engagement types (advisory retainer, project-based, fractional CTO, workshops) not yet defined. May not need definition for website but PRD/UX should decide how much to surface.
- **Productized offerings**: None defined. Flagged as potential future addition (assessments, frameworks, workshops) for scaling beyond time-for-money. Out of scope for launch but site architecture should not make it hard to add later.
- **Content migration specifics**: Which existing tech/AI posts survive? Need to audit `src/content/posts/` during implementation to decide post-by-post.
- **LinkedIn integration depth**: CTA only, or embedded LinkedIn feed/activity? User hasn't specified.
- **Existing domain/DNS setup**: hentges.ai domain assumed but DNS configuration for Cloudflare Pages not discussed.

## Scope Signals

- **Definite in**: Homepage, About, Contact, Blog listing, Blog posts, visual redesign, Astro + Tailwind v4, Cloudflare Pages, SEO basics, 1-2 new blog posts, LinkedIn CTA
- **Definite out**: Contact forms, CRM, newsletter, advanced analytics, portfolio page, services page, audience-specific pages, hobby content, multi-author, productized offerings
- **Maybe later**: Newsletter (if cadence sustainable), productized offerings (if defined), advanced analytics (if diagnostic need arises), selectivity positioning ("I take on a small number of engagements")

## Brand & Messaging Assets

- **Brand thesis**: "I help organizations build the right thing, the right way, faster — using AI as an accelerator, not a shortcut."
- **Brand voice**: "Experienced guide who can help you vibe" — credible but approachable, opinionated but practical
- **Five pillars**: Builder Who Reads Systems, Problem Translator, AI Amplifies Architects, Production Not Prototypes, Operator Not Just Advisor
- **Primary recognition signals**: "Make your team 100x more valuable" (VP/IT Director), "Production, not prototypes" (SI CEO/CTO)
- **Unifying audience message**: "AI should create durable value, not theater"
- **Blog brand promise**: "You'll leave with a clearer, less fashionable, more useful view of AI than you arrived with"
- **Flagship content**: "What People Are Getting Wrong About AI" — contrarian piece challenging cost-reduction narrative
- **User's natural messaging style**: Mike generates concise, resonant messaging instinctively. The strongest lines came from his direct responses, not facilitation.

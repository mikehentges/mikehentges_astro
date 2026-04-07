# Story 5.3: Launch Blog Posts

Status: done

## Story

As a site owner,
I want 1-2 fresh blog posts published at launch that reinforce the brand,
so that the site launches with current content that demonstrates my thinking, not just migrated archives.

## Acceptance Criteria

1. **Given** 1-2 new blog posts are written, **when** they are added to `src/content/posts/` with co-located hero images, **then** frontmatter validates against the content schema (title, date, summary, hero) and posts appear on the blog listing page and in the homepage Recent Writing section.

2. **Given** each new launch post, **when** viewed at `/blog/[slug]`, **then** it has a working AuthorBio block below the content.

3. **Given** the new launch posts, **when** reviewed for content, **then** they reinforce brand themes (AI as accelerator, building the right thing, practitioner credibility) and demonstrate the voice and quality expected of the site going forward.

## Tasks / Subtasks

- [x] Task 1: Write launch blog post #1 — AI-focused thought leadership (AC: 1, 2, 3)
  - [x] 1.1 Create directory `src/content/posts/ai-is-an-accelerator-not-a-shortcut/`
  - [x] 1.2 Write `index.md` with frontmatter: title, date (2026-04-07), summary, hero reference
  - [x] 1.3 Write ~800-1200 word post reinforcing the brand thesis
  - [x] 1.4 Provide a hero image (`hero.png`) — generated dark gradient placeholder

- [x] Task 2: Write launch blog post #2 — Practitioner perspective (AC: 1, 2, 3)
  - [x] 2.1 Create directory `src/content/posts/what-twenty-years-of-building-taught-me-about-ai/`
  - [x] 2.2 Write `index.md` with frontmatter: title, date (2026-04-07), summary, hero reference
  - [x] 2.3 Write ~800-1200 word post from practitioner perspective
  - [x] 2.4 Provide a hero image (`hero.png`) — generated dark gradient placeholder

- [x] Task 3: Build verification (AC: 1, 2)
  - [x] 3.1 Run `pnpm build` — 0 errors, 12 pages built (up from 10)
  - [x] 3.2 Verify new posts appear in blog listing — both are first and second (newest first)
  - [x] 3.3 Verify new posts appear in homepage Recent Writing section — both in top 3
  - [x] 3.4 Verify AuthorBio renders on each new post page — confirmed

## Dev Notes

### Content Direction & Brand Themes

The PRD defines Mike's positioning: *"AI is an accelerator, not a shortcut — and you still need someone who knows how to build the right thing, the right way, for your situation."*

Posts should:
- Lead with empowerment, not credentials
- Speak to technology leaders (CIOs, CTOs, VPs of Engineering) who are evaluating AI adoption
- Demonstrate opinionated thinking, not generic advice
- Sound like a practitioner who builds, not a consultant who advises from the outside
- Use first-person voice, conversational but authoritative

### Writing Voice (from existing posts)

Existing posts are technical and educational with first-person narrative. The new launch posts should shift toward **strategic thought leadership** rather than pure technical tutorial — more "here's how I think about this" and less "here's how to code this."

### Post Topic Suggestions

**Post 1 — "AI Is an Accelerator, Not a Shortcut"**
Core argument: The teams getting the most from AI already know how to build. AI amplifies good fundamentals — clear requirements, sound architecture, experienced judgment. It doesn't compensate for their absence. Aimed at leaders tempted by vendor promises.

**Post 2 — "What Twenty Years of Building Taught Me About AI"**
Core argument: Enterprise building experience is the best lens for evaluating AI. Pattern recognition from decades of system delivery helps distinguish AI hype from AI value. Personal narrative weaving CTO → IT Director → AI practitioner journey.

### Content Schema

From `src/content.config.ts`:
```typescript
title: z.string(),
date: z.date(),
summary: z.string(),
hero: image(),
```

### Frontmatter Format (follow existing pattern)

```yaml
---
title: "Post Title Here"
date: 2026-04-07
summary: "One to two sentence summary for blog cards and meta description."
hero: ./hero.jpg
---
```

### Hero Images

- Co-located in each post directory as `hero.jpg` (JPG preferred, 27-71KB range in existing posts)
- Processed by Astro's Sharp pipeline at build time → WebP output
- Used as `og:image` for social sharing (from Story 5-1)
- Since we cannot generate images in this environment, create a simple text-based SVG placeholder or reuse/reference an appropriate existing image

### File Structure

```
src/content/posts/
  ai-is-an-accelerator-not-a-shortcut/
    index.md
    hero.jpg
  what-twenty-years-of-building-taught-me-about-ai/
    index.md
    hero.jpg
```

### Do NOT

- Do not modify the content schema or any existing components
- Do not modify existing blog posts
- Do not add categories, tags, or any metadata not in the schema
- Do not write content that reads like AI-generated marketing copy — it should have Mike's practitioner voice

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 5.3]
- [Source: _bmad-output/planning-artifacts/prd.md#Content Migration]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (1M context)

### Debug Log References

- Hero images generated as 1200x630 dark gradient PNGs via Python (no PIL required)
- Both posts use .png hero images (Astro processes to WebP at build time)

### Completion Notes List

- Post 1: "AI Is an Accelerator, Not a Shortcut" — ~900 words, strategic thought leadership on AI adoption
- Post 2: "What Twenty Years of Building Taught Me About AI" — ~1100 words, practitioner narrative weaving career experience with AI perspective
- Both posts reinforce brand themes: AI as amplifier, fundamentals matter, practitioner credibility
- Both validate against content schema and render with AuthorBio
- Hero images are dark gradient placeholders — Mike should replace with real images before launch

### File List

- src/content/posts/ai-is-an-accelerator-not-a-shortcut/index.md (new)
- src/content/posts/ai-is-an-accelerator-not-a-shortcut/hero.png (new)
- src/content/posts/what-twenty-years-of-building-taught-me-about-ai/index.md (new)
- src/content/posts/what-twenty-years-of-building-taught-me-about-ai/hero.png (new)

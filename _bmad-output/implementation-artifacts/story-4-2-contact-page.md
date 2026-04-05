# Story 4.2: Contact Page

Status: done

## Story

As a convinced prospect,
I want a simple, direct way to reach out,
so that contacting Mike feels personal and low-friction, not like entering a sales funnel.

## Acceptance Criteria

1. **Given** the Contact page at `/contact`, **when** it renders, **then** it displays a `mailto:mike@hentges.ai` link styled as a text link with amber underline, a LinkedIn profile link, brief framing text ("I take on a small number of advisory and project engagements each year." or similar), and there is no contact form of any kind.

2. **Given** the Contact page, **when** a visitor clicks the email link, **then** their default email client opens with mike@hentges.ai as the recipient.

3. **Given** the Contact page, **when** examined for design, **then** the simplicity IS the trust signal — the page is intentionally minimal. It renders responsively across all breakpoints.

## Tasks / Subtasks

- [x] Task 1: Build Contact page content and structure (AC: 1, 2, 3)
  - [x] 1.1 Replace placeholder in `src/pages/contact.astro` with full page implementation
  - [x] 1.2 Add h1 heading with `aria-labelledby` on wrapping `<article>` (pattern from story 4-1)
  - [x] 1.3 Add brief framing text — conversational, not salesy
  - [x] 1.4 Add `mailto:mike@hentges.ai` link using `.link-text` class (amber text + 2px underline)
  - [x] 1.5 Add LinkedIn profile link (`https://www.linkedin.com/in/mikehentges/`) — satisfies FR11 for contact page
  - [x] 1.6 Ensure NO contact form exists — simplicity is the design

- [x] Task 2: Responsive and accessibility verification (AC: 3)
  - [x] 2.1 Verify heading hierarchy: h1 only — no skipped levels
  - [x] 2.2 Verify responsive layout across breakpoints
  - [x] 2.3 Verify `aria-current="page"` on Contact nav link (handled by StickyNav)
  - [x] 2.4 Run `pnpm build` — zero errors, page renders at `/contact`

## Dev Notes

### Page Structure Pattern

Follow the pattern established in story 4-1 (About page):

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="Contact | Hentges.AI">
  <article aria-labelledby="contact-heading" class="prose-width py-12 md:py-16">
    <h1 id="contact-heading" class="font-display text-4xl font-bold leading-tight md:text-[2.5rem]">
      <!-- Heading -->
    </h1>
    <!-- Framing text + links -->
  </article>
</BaseLayout>
```

### Key Implementation Details

- **No new components needed.** This is a minimal content page using BaseLayout only.
- **No CTASection on this page.** The contact page IS the CTA destination — adding CTASection would be circular.
- **BaseLayout props:** `title="Contact | Hentges.AI"` — do NOT pass `transparent={true}`.
- **Email link:** Use `.link-text` class for the mailto link (amber text with 2px border-bottom underline). This class is already defined in `global.css`.
- **LinkedIn link:** Use same `.link-text` styling or inline amber link pattern. Must open in new tab (`target="_blank" rel="noopener noreferrer"`).
- **prose-width class:** Apply to `<article>` for 680px max content width.
- **Spacing pattern:** `py-12 md:py-16` on article (consistent with About page).
- **aria-labelledby:** Add `id` to h1, reference from `<article>` (learned from story 4-1 code review).

### Content Guidelines

**Tone:** The page should feel like a personal invitation, not a corporate contact form. The absence of a form IS the trust signal — it says "I'm a real person, not a funnel."

**Required elements:**
- Framing text: Something like "I take on a small number of advisory and project engagements each year." — brief, human, sets expectations
- Email: `mike@hentges.ai` as a clickable mailto link
- LinkedIn: `https://www.linkedin.com/in/mikehentges/` (satisfies FR11)

**The page should be intentionally sparse.** A few lines of text, two links, done. The restraint IS the design.

### Anti-Patterns to Avoid

- Do NOT create new components — this is a content page
- Do NOT add a contact form of any kind
- Do NOT use `@apply` — Tailwind utility classes only
- Do NOT use raw hex colors — use theme tokens
- Do NOT add `transparent` prop to BaseLayout
- Do NOT add CTASection (this page IS the contact destination)
- Do NOT skip heading levels

### Previous Story Intelligence (4-1-about-page)

- Used `<article aria-labelledby="...">` with `id` on h1 — apply same pattern
- `prose-width py-12 md:py-16` on article wrapper — reuse
- h1 styling: `font-display text-4xl font-bold leading-tight md:text-[2.5rem]` — reuse
- Code review found: always add `aria-labelledby` on `<article>` — already incorporated above
- Code review deferred: no SEO meta tags — same applies here, addressed in Epic 5

### Existing Components Reference

| Component | Import Path | Usage on Contact Page |
|-----------|-------------|----------------------|
| BaseLayout | `../layouts/BaseLayout.astro` | Page wrapper with nav + footer |

### Project Structure Notes

- File to modify: `src/pages/contact.astro` (replace existing placeholder)
- No new files needed
- Architecture doc confirms: `/contact` route uses BaseLayout only (no additional components)

### References

- [Source: _bmad-output/planning-artifacts/architecture.md — Route-Component Mapping]: `/contact` uses BaseLayout, no additional components
- [Source: _bmad-output/planning-artifacts/epics.md — Story 4.2]: Full acceptance criteria
- [Source: _bmad-output/planning-artifacts/prd.md — Scope]: Contact page with direct email, LinkedIn, no forms
- [Source: src/pages/about.astro]: Previous story pattern (article wrapper, aria-labelledby, spacing)
- [Source: src/styles/global.css]: `.link-text` class (amber text + 2px border-bottom underline)
- [Source: src/components/AuthorBio.astro]: LinkedIn link pattern with `target="_blank" rel="noopener noreferrer"`

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (1M context)

### Debug Log References

None — clean implementation.

### Completion Notes List

- Replaced placeholder contact.astro with intentionally minimal contact page
- h1 "Get in touch." with aria-labelledby on article wrapper
- Framing text sets expectations: "small number of advisory and project engagements"
- mailto:mike@hentges.ai with .link-text class (amber + underline)
- LinkedIn link with target="_blank" rel="noopener noreferrer" — satisfies FR11
- No contact form — simplicity is the trust signal
- No CTASection — this page IS the CTA destination
- Build passes: 0 errors, 10 pages, /contact/index.html generated
- Applied learnings from 4-1 code review: aria-labelledby on article

### File List

- `src/pages/contact.astro` (modified — replaced placeholder with full implementation)

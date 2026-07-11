# SEO / AEO / GEO / FDE Implementation Plan

## Summary

Implement the full SEO/AEO/GEO strategy for the portfolio with these locked decisions:

- Canonical public identity name: `Samir Shaikh`
- Canonical public email: `22amtics312@gmail.com`
- Scope: full strategy pass, including repo-backed SEO/schema/metadata work plus CMS-backed content updates for quantified proof points and a new FDE-oriented blog post

This plan is grounded in the current codebase. It separates source-code changes from CMS/content updates because the About, Blog, and Project long-form content is stored in the database and edited through the existing admin UI rather than checked into the repo.

## Current State Analysis

### Verified strengths already in place

- `app/layout.tsx` already defines root metadata, canonical homepage URL, `Person` and `WebSite` JSON-LD, Open Graph, Twitter metadata, and robots rules.
- `app/blogs/[slug]/page.tsx` and `app/projects/[slug]/page.tsx` already implement `generateStaticParams()`.
- Canonical URLs already exist on the public list/detail pages that were inspected: `app/about/page.tsx`, `app/blogs/page.tsx`, `app/blogs/[slug]/page.tsx`, `app/contact/page.tsx`, `app/projects/page.tsx`, `app/projects/[slug]/page.tsx`, and `app/resume/page.tsx`.
- `components/about/FAQ.tsx` already renders visible FAQ content and `FAQPage` schema.
- `app/blogs/[slug]/page.tsx` and `app/projects/[slug]/page.tsx` already emit `BreadcrumbList` schema.
- Existing admin/CMS flows already support editing the long-form content that matters for AEO/GEO:
  - `app/admin/about/page.tsx` edits the About HTML stored in the `about` table.
  - `components/admin/BlogForm.tsx` edits blog `title`, `excerpt`, and `content`.
  - `components/admin/ProjectForm.tsx` edits project `title`, `excerpt`, and `content`.

### Verified gaps to fix

- Public metadata titles are inconsistent: several pages still use `Shaikh Samir` while root metadata and most schema use `Samir Shaikh`.
- Public email is inconsistent:
  - `app/layout.tsx` `Person.email` already uses `22amtics312@gmail.com`.
  - `public/llms.txt` still uses `shaikh.samir.dev@gmail.com`.
  - `public/.well-known/security.txt` uses `22amtics312@gmail.com`.
  - `lib/auth.ts` also allowlists `22amtics312@gmail.com`, so the chosen canonical email aligns with auth.
- There is no meaningful `Forward Deployed Engineer` signal in:
  - `app/layout.tsx` metadata keywords/description/schema
  - `public/llms.txt`
  - visible homepage copy in `components/home/Hero.tsx`
  - About FAQ content in `components/about/FAQ.tsx`
- The strategy document references `seo-changes.md`, but that file is not present in the current repo, and the specific fixes it mentions are already partly implemented. The remaining work should therefore be based on the current code instead of that missing file.
- The most important AEO/GEO improvements for About, Projects, and the new blog post are content-backed, not code-backed:
  - About body content comes from the `about` table.
  - Blog/project descriptions and long-form copy come from the `blogs` and `projects` tables.

## Proposed Changes

### 1. Unify public identity across metadata, schema, and reply email defaults

#### Files

- `app/about/page.tsx`
- `app/blogs/page.tsx`
- `app/blogs/[slug]/page.tsx`
- `app/contact/page.tsx`
- `app/projects/page.tsx`
- `app/projects/[slug]/page.tsx`
- `app/resume/page.tsx`
- `app/api/contact/[id]/reply/route.ts`

#### What / why / how

- Replace remaining `Shaikh Samir` title strings and author-name strings with `Samir Shaikh`.
- Keep `app/layout.tsx` as the source of truth for the name because it already matches the preferred entity format.
- Update the default contact-reply `from` fallback in `app/api/contact/[id]/reply/route.ts` so automated emails use the same public entity name when `NEXT_PUBLIC_SITE_NAME` is absent.
- In `app/projects/[slug]/page.tsx`, update the JSON-LD `author.name` from `Shaikh Samir` to `Samir Shaikh` to remove schema-level entity drift.

### 2. Standardize the canonical public email everywhere the site exposes identity

#### Files

- `public/llms.txt`
- `app/layout.tsx`
- `public/.well-known/security.txt`
- `lib/auth.ts`

#### What / why / how

- Keep `22amtics312@gmail.com` as the canonical public email because the user selected it and it already matches:
  - root `Person` schema
  - `security.txt`
  - GitHub auth allowlist
- Update `public/llms.txt` to use the canonical email.
- Review `app/layout.tsx` only to preserve consistency while making the surrounding metadata edits; the value itself may not need to change.
- Review `public/.well-known/security.txt` to keep it aligned after the broader identity cleanup.
- Review `lib/auth.ts` to ensure the canonical email remains on the allowlist; no behavior change is required unless cleanup of secondary legacy emails is explicitly desired during execution.

### 3. Add FDE positioning to metadata, schema, and visible homepage copy

#### Files

- `app/layout.tsx`
- `components/home/Hero.tsx`
- `public/llms.txt`

#### What / why / how

- Extend `app/layout.tsx` metadata to add natural FDE-adjacent positioning without falsely claiming prior FDE employment:
  - add `Forward Deployed Engineer`
  - add adjacent variants such as `Applied AI Engineer` and `Customer-Facing Engineer`
  - revise root/home description text to mention exploring roles that combine backend depth with customer ownership
- Extend `Person.knowsAbout` in `app/layout.tsx` with concepts that match the strategy:
  - `Forward Deployed Engineering`
  - `Customer-Embedded Problem Solving`
  - `End-to-End Ownership`
- Update the visible hero copy in `components/home/Hero.tsx` so the site does not rely on metadata alone for the new positioning. Keep the language honest and future-facing, for example: AI backend engineering plus customer-facing, ambiguity-heavy problem solving.
- Update `public/llms.txt`:
  - add `Forward Deployed Engineer` to `Career Goals`
  - expand keywords with 1-2 adjacent-title variants
  - add a short summary line explaining the role fit in terms of customer context, ambiguity tolerance, and end-to-end delivery

### 4. Extend FAQ schema and visible About-page FAQs for extractable FDE answers

#### Files

- `components/about/FAQ.tsx`

#### What / why / how

- Add 2-3 new FAQ entries that start with a direct, one-sentence answer before the supporting detail.
- Ensure the new entries are both:
  - visible on the page
  - included automatically in the existing `FAQPage` schema payload
- Focus the new questions on extractable FDE intent, for example:
  - whether Samir is interested in Forward Deployed Engineer roles
  - why customer-embedded engineering is a strong fit
  - how existing backend/AI work maps to ambiguity-heavy deployment work
- Keep all claims factual and tied to actual projects or work patterns already represented in the portfolio.

### 5. Add answer-first copy in the repo where content is code-backed

#### Files

- `components/home/Hero.tsx`
- `components/about/FAQ.tsx`
- `app/layout.tsx`

#### What / why / how

- Rewrite the homepage hero sentence to lead with the most extractable value proposition instead of a generic intro.
- Ensure FAQ answers begin with the direct answer and only then elaborate.
- Tune root metadata description so the first clause names the role and outcomes before listing tools.

### 6. Execute answer-first and quantified-proof updates through the existing admin CMS

#### Runtime surfaces / supporting files

- `app/admin/about/page.tsx`
- `components/admin/BlogForm.tsx`
- `components/admin/ProjectForm.tsx`
- `lib/schema.ts`

#### What / why / how

- Use the existing admin editors, not source-code files, to update data-backed content after the code changes ship.
- About content:
  - rewrite the opening paragraph in the About rich text so the first 1-2 sentences directly describe current fit and direction
  - keep the wording honest: pursuing FDE-style roles, not claiming the title as prior employment
- Project content:
  - update project `excerpt` and first paragraph in each high-priority project so they start with the outcome/result
  - add real numbers wherever available, such as throughput, time savings, latency, message volume, users, or delivery scope
- `public/llms.txt` should mirror the strongest quantified proof points that also appear in project content to improve cross-document consistency.
- No schema changes are required because `lib/schema.ts` already stores the necessary freeform text fields.

### 7. Publish a new first-person FDE journey blog post using the existing blog CMS

#### Runtime surfaces / supporting files

- `components/admin/BlogForm.tsx`
- `app/blogs/page.tsx`
- `app/blogs/[slug]/page.tsx`

#### What / why / how

- Create a new published blog post through the existing admin blog form; no new blog infrastructure is needed.
- The post should be first-person, specific, and recent, covering:
  - why FDE-style work is attractive
  - how current backend/AI projects map to customer-facing deployment work
  - lessons from the VideoSDK process or adjacent real interview preparation, if those examples are factual and comfortable to share
- Make the title and excerpt explicitly FDE-relevant but natural.
- Use the post excerpt as an answer-first summary so list pages, OG images, and metadata inherit a concise extractable statement.

### 8. Preserve and extend existing structured SEO signals rather than rebuilding them

#### Files

- `app/blogs/[slug]/page.tsx`
- `app/projects/[slug]/page.tsx`
- `app/layout.tsx`

#### What / why / how

- Do not rebuild canonical URLs, `generateStaticParams()`, or `BreadcrumbList`; they are already present and should remain intact.
- While touching these files for identity cleanup, verify that:
  - canonical URLs still point to the production base URL logic
  - Open Graph and Twitter fields stay aligned with updated titles/descriptions
  - JSON-LD author identity matches the canonical public name

## Assumptions & Decisions

- The implementation will use `Samir Shaikh` as the only public display-name format.
- The implementation will use `22amtics312@gmail.com` as the canonical public identity email.
- `Forward Deployed Engineer` will be framed as an active direction / target role / fit, not as a historical job title.
- The repo changes can fully cover metadata/schema/FAQ/hero/`llms.txt` updates, but some of the highest-value AEO/GEO improvements require content updates in the running admin CMS because the source of truth lives in the database.
- The missing `seo-changes.md` file will not be recreated; execution should work from the verified current source files instead.
- Quantified claims and attributed quotes must be real. If no trustworthy numbers or quote are available at execution time, those individual copy additions should be skipped rather than invented.

## Verification Steps

1. Run targeted search checks to confirm there are no remaining public-facing `Shaikh Samir` strings in the intended SEO surfaces after edits.
2. Run targeted search checks to confirm `public/llms.txt`, `app/layout.tsx`, and `public/.well-known/security.txt` all expose the canonical email consistently.
3. Run `eslint` or targeted diagnostics on every edited source file.
4. Inspect the rendered homepage, About page, Blog detail page, and Project detail page to verify:
   - updated metadata strings
   - visible FDE copy
   - updated FAQ entries
   - unchanged layout behavior
5. Validate emitted schema manually in page source for:
   - `Person`
   - `FAQPage`
   - `BlogPosting`
   - `SoftwareApplication`
   - `BreadcrumbList`
6. After code deployment, complete the CMS/data tasks:
   - update About opening copy
   - revise priority project excerpts/content with real numbers
   - publish the new FDE blog post
7. Re-run manual spot checks on the affected pages to confirm metadata, visible copy, and CMS-backed content are aligned.

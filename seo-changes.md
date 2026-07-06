# SEO Changes Required

Based on `nextjs-portfolio-seo-report.md` audit, the following gaps need addressing.

---

## 1. Add `generateStaticParams` for Pre-built Pages

**Issue:** Project and blog detail pages use ISR (`revalidate = 3600`) but are never pre-built at build time. The report recommends SSG + ISR with `generateStaticParams` for evergreen content that changes infrequently.

**Files:**
- `app/projects/[slug]/page.tsx`
- `app/blogs/[slug]/page.tsx`

**Fix:**
```ts
export async function generateStaticParams() {
  const projects = await db
    .select({ slug: projectsSchema.slug })
    .from(projectsSchema)
    .where(eq(projectsSchema.isPublished, true));
  return projects.map((p) => ({ slug: p.slug }));
}
```

---

## 2. Add Canonical URLs on Detail Pages

**Issue:** `blogs/[slug]` and `projects/[slug]` `generateMetadata` don't set `alternates.canonical`. The layout sets a global canonical, but each detail page needs its own. Report §4-5: "Set a canonical URL for every indexable page."

**Files:**
- `app/blogs/[slug]/page.tsx`
- `app/projects/[slug]/page.tsx`

**Fix (both files):**
```ts
return {
  title: `${project.title} | Shaikh Samir`,
  description: project.excerpt || `...`,
  alternates: {
    canonical: `${process.env.NEXTAUTH_URL}/projects/${project.slug}`,
  },
  openGraph: { ... },
};
```

---

## 3. Add Twitter Card Overrides on Detail Pages

**Issue:** `generateMetadata` sets OpenGraph but not Twitter card metadata. Pages fall back to layout defaults, but each page should define its own card with the specific page's image. Report §4 recommends defining both.

**Files:**
- `app/blogs/[slug]/page.tsx`
- `app/projects/[slug]/page.tsx`

**Fix (both files):**
```ts
return {
  title: ...,
  description: ...,
  alternates: { canonical: ... },
  openGraph: {
    title: ...,
    description: ...,
    images: project.cover_image_url ? [project.cover_image_url] : [],
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: ...,
    description: ...,
    images: project.cover_image_url ? [project.cover_image_url] : [],
  },
};
```

Also add Twitter card + canonical to these list pages:
- `app/about/page.tsx`
- `app/blogs/page.tsx`
- `app/projects/page.tsx`
- `app/contact/page.tsx`
- `app/resume/page.tsx`

---

## 4. Add Twitter Card + Canonical on List Pages

**Issue:** List pages (`about`, `blogs`, `projects`, `contact`, `resume`) have simple `metadata` with only `title` and `description`. Missing OG, Twitter, and canonical. Report §4: every important page should define OG + Twitter + canonical.

**Files:**
- `app/about/page.tsx`
- `app/blogs/page.tsx`
- `app/projects/page.tsx`
- `app/contact/page.tsx`
- `app/resume/page.tsx`

**Fix (example for about):**
```ts
export const metadata: Metadata = {
  title: "About | Shaikh Samir",
  description: "...",
  alternates: {
    canonical: `${process.env.NEXTAUTH_URL}/about`,
  },
  openGraph: {
    title: "About | Shaikh Samir",
    description: "...",
  },
  twitter: {
    card: "summary_large_image",
    title: "About | Shaikh Samir",
    description: "...",
  },
};
```

---

## 5. Generate Dynamic OG Images per Page

**Issue:** No `opengraph-image.tsx` route handler. All pages share a single `Filled_Logo.png` for OG/Twitter cards. Report §13 recommends unique branded OG images for major pages and flagship projects.

**Fix:** Create `app/projects/[slug]/opengraph-image.tsx` and `app/blogs/[slug]/opengraph-image.tsx` using `ImageResponse` from `next/og` to generate dynamic OG images with the page title, excerpt, and branding.

---

## 6. Add Missing Structured Data Schemas

**Issue:** Report §7 recommends `BreadcrumbList`, `WebSite`, and `WebPage` schemas. Currently only `Person` (layout), `BlogPosting` (blog detail), `SoftwareApplication` (project detail), and `FAQPage` (about) exist.

### 6a. BreadcrumbList

**Files:** `app/projects/[slug]/page.tsx`, `app/blogs/[slug]/page.tsx`

**Fix (add alongside existing JSON-LD):**
```ts
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", position: 1, name: "Home", item: APP_URL },
    { "@type": "ListItem", position: 2, name: "Projects", item: `${APP_URL}/projects` },
    { "@type": "ListItem", position: 3, name: project.title }
  ]
}
```

### 6b. WebSite schema

**File:** `app/layout.tsx` (add alongside Person schema)

```ts
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Samir Shaikh Portfolio",
  "url": APP_URL,
  "description": "Portfolio of Samir Shaikh, AI Backend Engineer..."
}
```

---

## 7. Lazy-Load Heavy Client Components

**Issue:** `Chatbot`, `CloudTransition`, and `PushSettings` are loaded on every page globally without lazy loading. Report §9 recommends `dynamic()` imports with `ssr: false` for non-critical interactive features.

**File:** `app/layout.tsx`

**Fix:**
```ts
const Chatbot = dynamic(() => import("@/components/Chatbot"), { ssr: false });
const CloudTransition = dynamic(() => import("@/components/layout/CloudTransition"), { ssr: false });
const PushSettings = dynamic(() => import("@/components/PushSettings"), { ssr: false });
```

---

## 8. Add `priority` on List Page LCP Images

**Issue:** `ProjectList` and `BlogList` card images don't use `priority`. The first (likely LCP) card image on list pages should be prioritized. Report §6: "Use the `priority` prop only for the page's true hero or LCP image."

**Files:**
- `components/projects/ProjectList.tsx`
- `components/blogs/BlogList.tsx`

**Fix (add `priority` to first visible image):**
```tsx
{filteredProjects.map((project, index) => (
  ...
  <Image
    src={project.cover_image_url}
    alt={project.title}
    fill
    priority={index === 0}
    ...
  />
))}
```

---

## 9. Improve Image Alt Text

**Issue:** Cover images use `alt={project.title}` / `alt={blog.title}` which is functional but not descriptive. Report §6 recommends descriptive alt text that describes the image content and purpose.

**Files:**
- `components/projects/ProjectList.tsx` (line 77)
- `components/blogs/BlogList.tsx` (line 83)
- `app/projects/[slug]/page.tsx` (line 165)
- `app/blogs/[slug]/page.tsx` (line 134)

**Fix example:** `alt={`Screenshot of ${project.title} project showing the main interface`}`

> **Note:** This may require an additional DB field for image descriptions, or using the project excerpt contextually.

---

## 10. Add Internal Cross-Linking Between Related Content

**Issue:** Blog detail pages don't link to related blogs; project detail pages don't link to related projects. No "related posts" or "similar projects" sections. Report §11: "Link between related projects using shared topics."

**Files:**
- `app/blogs/[slug]/page.tsx` — add "Related Posts" section before comments, querying blogs with similar content
- `app/projects/[slug]/page.tsx` — add "Similar Projects" section, querying projects sharing technologies

**Approach:**
```tsx
// Fetch related blogs (sharing same category or latest)
const related = await db.select(...)
  .from(blogs)
  .where(and(eq(blogs.isPublished, true), ne(blogs.slug, slug)))
  .limit(3)
  .orderBy(desc(blogs.publishedAt));
```

---

## Summary Priority

| Priority | Item | Effort |
|----------|------|--------|
| P0 | Canonical URLs on detail pages | Low |
| P0 | Twitter card overrides on detail pages | Low |
| P1 | `generateStaticParams` | Low |
| P1 | Dynamic OG image generation | Medium |
| P1 | Lazy-load heavy client components | Low |
| P1 | Structured data: BreadcrumbList + WebSite | Low |
| P2 | `priority` on list page LCP images | Low |
| P2 | Twitter card + canonical on list pages | Low |
| P2 | Internal cross-linking for related content | Medium |
| P3 | Improve image alt text | Low |

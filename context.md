# Samir's Portfolio — AI Context

## Project Overview
Personal portfolio & blog for Samir (Node.js Backend Developer). Live at [shreyashswami.is-a.dev](https://shreyashswami.is-a.dev). Full-featured site with admin panel, AI chatbot, PWA, push notifications, and blog with comments/stars.

## Tech Stack
- **Framework:** Next.js 16 (App Router), React 19, TypeScript 5
- **Styling:** Tailwind CSS v4 with `@tailwindcss/typography`, dark/light mode via `next-themes`
- **Database:** Neon (serverless PostgreSQL) + Drizzle ORM + pgvector
- **Auth:** NextAuth v5 (GitHub OAuth + Credentials)
- **AI/ML:** Vercel AI SDK (`@ai-sdk/google` for embeddings, `@ai-sdk/groq` for chat), RAG with vector search
- **Media:** Cloudinary (image hosting), sharp (optimization)
- **PWA:** Serwist (service worker + push notifications via web-push)
- **Email:** Nodemailer (SMTP)
- **Package Manager:** pnpm

## Project Structure
```
app/                    # Next.js App Router
├── api/                # 14 API route groups (30 files)
│   ├── about/         GET, PUT
│   ├── auth/          [...nextauth]
│   ├── blogs/         CRUD + star + comment + slug lookup
│   ├── chat/          POST (streaming AI)
│   ├── contact/       POST (public) + admin read/reply
│   ├── experience/    GET, PUT (bulk replace)
│   ├── media/         GET, DELETE (Cloudinary)
│   ├── pdf-proxy/     GET (CORS proxy)
│   ├── projects/      CRUD + slug lookup
│   ├── push/          subscribe, subscribers, send
│   ├── rag/           seed (rebuild vector store)
│   ├── resume/        GET, PUT
│   ├── socials/       GET, PUT (bulk replace)
│   └── upload/        POST (sharp + Cloudinary)
├── about/             Server page, ISR 3600
├── admin/             Protected admin dashboard
│   ├── about/         TipTapEditor for description
│   ├── blogs/         BlogForm + list with publish toggle
│   ├── contact/       Message list + reply modal
│   ├── experience/    Accordion CRUD with reorder
│   ├── media/         Image grid
│   ├── notifications/ Compose + subscriber list + logs
│   ├── projects/      ProjectForm + list with publish toggle
│   ├── resume/        URL input + PDF preview
│   └── socials/       List with reorder + icon picker
├── blogs/             Public blog listing + [slug] detail
├── projects/          Public project listing + [slug] detail
├── contact/           ContactForm (client component)
├── resume/            ResumeViewer (PDF via react-pdf)
├── login/             Login form (GitHub + credentials)
├── layout.tsx         Root layout: Navbar, Footer, ThemeProvider, Chatbot, PushSettings, CloudTransition
├── page.tsx           Home: Hero (GitHub stats) + featured blogs/projects
├── globals.css        Tailwind v4 + prose styling + dark mode vars
├── manifest.ts        PWA manifest
├── sitemap.ts         Dynamic sitemap (all published content)
├── robots.ts          Disallow /admin/ and /api/
└── sw.ts              Serwist service worker + push event handlers
components/
├── admin/             BlogForm, ProjectForm, TipTapEditor, MediaLibraryModal, DatePicker, etc.
├── about/             ExperienceTimeline (server), FAQ (static + JSON-LD)
├── blogs/             BlogList (searchable grid), BlogInteractions, BlogStarInteraction
├── projects/          ProjectList (searchable grid)
├── home/              Hero (GitHub stats bento, server component)
├── layout/            Navbar, Footer (server, dynamic from DB), PageHeader, CloudTransition
├── resume/            PDFViewer (react-pdf), ResumeViewer
└── theme/             ThemeProvider, ThemeToggle
├── Chatbot.tsx        Floating AI sidebar (useChat + FingerprintJS)
├── ContentWithToc.tsx Combines HtmlParser + TableOfContents
├── HtmlParser.tsx     HTML → React (next/Image for <img> tags)
├── PushSettings.tsx   Web Push subscription prompt
├── SocialIcons.tsx    Platform → icon mapping (60+ platforms)
└── TableOfContents.tsx IntersectionObserver-based heading tracker
lib/
├── auth.ts            NextAuth v5 config (GitHub whitelist + credentials)
├── db.ts              Neon + Drizzle initialization
├── schema.ts          12 Drizzle table definitions
├── cloudinary.ts      Cloudinary v2 config
├── github.ts          GraphQL stats + REST events (1h cache)
├── rag.ts             Chunk + embed + index/delete documents
├── utils.ts           cn() classname helper
└── chat/
    ├── prompt.ts      System prompt for AI personality
    ├── retrieval.ts   Vector search + GitHub context builder
    └── security.ts    Rate limiting + VPN/proxy blocking
drizzle/               SQL migrations
```

## Database Schema (12 tables)

| Table | Key Details |
|---|---|
| `admin_users` | email (unique), password |
| `projects` | slug (unique), technologies[], is_published, stars: no, comments: no |
| `blogs` | slug (unique), stars (int), comments (jsonb[]: `{name, comment, createdAt}`), is_published |
| `about` | description (single row, no id) |
| `resume` | resume (single row, URL string) |
| `contact` | name, email, subject, message, seen (bool) |
| `socials` | name, url, display_order |
| `experiences` | company_name, logo_url, position, start_date, end_date, pay, is_current, display_order |
| `media` | url, public_id |
| `content_chunks` | source_id, source_type, chunk_text, embedding (vector 3072d) |
| `push_subscriptions` | endpoint (unique), subscription_json, topic |
| `sent_notifications` | title, body, url, image_url, target_topic, success_count |

## Common Patterns & Conventions

### Components
- **Server components** (`page.tsx`) do direct Drizzle queries with ISR (`revalidate = 3600`)
- **Client components** use `"use client"` directive, fetch via `fetch("/api/...")` in `useEffect`
- **Props interface** defined at top of file, exported

### CSS
- Tailwind v4 (`@import "tailwindcss"`)
- CSS custom properties in globals.css for theming: `--color-background`, `--color-foreground`, `--color-primary`, etc.
- Dark mode via `.dark` class
- Blog content styled via `.prose` class with `@tailwindcss/typography`
- Custom animation: `slideUpFade`

### Forms & Admin
- Create/edit forms use `BlogForm` / `ProjectForm` components
- Rich text via `TipTapEditor` (supports bold, italic, underline, headings, lists, blockquotes, code, links, images)
- Image selection via `MediaLibraryModal` (browse library or upload)
- Slug auto-generated from title (lowercase, replace spaces with hyphens, remove non-alphanumeric)
- Non-JSON API responses: `{ success: true }` or `{ error: "message" }`

### Auth Protection
- **Server pages:** `const session = await auth(); if (!session) redirect("/login");`
- **Client pages:** rely on API route auth (returns 401)
- **API routes:** `const session = await auth(); if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });`
- Public API routes: contact POST, blog star, blog comment, blog/project slug GET, chatbot, pdf-proxy

### Data Fetching (Server Components)
```ts
import { db } from "@/lib/db";
import { blogs } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";

// In the component function:
const data = await db.select().from(blogs).where(eq(blogs.isPublished, true)).orderBy(desc(blogs.publishedAt));
```

### Data Fetching (Client Components)
```ts
useEffect(() => {
  fetch("/api/blogs")
    .then(r => r.json())
    .then(setData)
    .catch(console.error);
}, []);
```

### Mutations (Client Components)
```ts
const res = await fetch(`/api/blogs/${id}`, {
  method: "PATCH",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ is_published: true }),
});
if (res.ok) { /* optimistic update */ }
```

### Error Handling
- API routes: try/catch, log error, return `{ error: "message" }` with 500
- Server components: try/catch, return empty array/string on failure
- Optimistic updates with rollback on error (publish toggles, star, seen status)

### Imports
- Always use `@/` alias for src files
- Schema imports: `import { blogs } from "@/lib/schema"`
- Component imports: `import { BlogList } from "@/components/blogs/BlogList"`

### SEO
- Static `metadata` export on list pages
- Dynamic `generateMetadata({ params })` on detail pages
- JSON-LD structured data via `<script>` with `dangerouslySetInnerHTML` (Person, BlogPosting, SoftwareApplication, FAQPage)

## Key API Conventions
- Blog/project identification: admin uses `[id]` (UUID), public uses `slug/[slug]`
- Bulk replace pattern (experience, socials): DELETE all → INSERT all in one PUT
- IDs are UUIDs generated by DB default
- Timestamps include timezone
- Blog comments stored as JSONB array with `{ name, comment, createdAt }`

## Environment Variables (from .env.example)
- `DATABASE_URL` — Neon Postgres connection string
- `AUTH_SECRET` — NextAuth secret
- `AUTH_GITHUB_ID` / `AUTH_GITHUB_SECRET` — GitHub OAuth
- `ADMIN_USERNAME` / `ADMIN_PASSWORD` — Credentials auth
- `NEXT_PUBLIC_VAPID_PUBLIC_KEY` / `VAPID_PRIVATE_KEY` / `VAPID_SUBJECT` — Web Push
- `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` — Cloudinary
- `GROQ_API_KEY` — AI chat model
- `GOOGLE_GENERATIVE_AI_API_KEY` — Gemini embeddings
- `GITHUB_TOKEN` — GitHub stats
- `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` — Nodemailer
- `AI_SECURITY` — Enable VPN/proxy blocking (optional)
- `AI_LIMIT` — Rate limit per visitor/day (default 5)
- `IPINFO_TOKEN` — IPinfo API (optional)
- `NEXT_PUBLIC_GA_ID` — Google Analytics (optional)

## Critical Rules
1. **Never commit secrets** — all keys go in `.env`, never in code
2. **Server components for reads, client components for interactivity**
3. **ISR with `revalidate = 3600`** on all public pages
4. **Optimistic UI updates** for toggles with rollback
5. **API routes always validate auth** for protected operations
6. **Use pnpm** (not npm or yarn)
7. **Blog/project content is HTML** from TipTap editor, rendered via `HtmlParser`
8. **Comments use JSONB** — append-only array pattern
9. **Push subscriptions upsert** on endpoint conflict
10. **RAG reindex happens automatically** on content create/update/delete

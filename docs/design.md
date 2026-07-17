# Design System — Samir's Portfolio

> This document is the single source of truth for the visual design language, component patterns, animation conventions, and layout rules used across this site. All new UI work should follow these guidelines.

---

## Table of Contents

1. [Design Philosophy](#1-design-philosophy)
2. [Color System](#2-color-system)
3. [Typography](#3-typography)
4. [Spacing & Layout](#4-spacing--layout)
5. [Borders & Shadows](#5-borders--shadows)
6. [Animation & Motion](#6-animation--motion)
7. [Component Patterns](#7-component-patterns)
8. [Page Patterns](#8-page-patterns)
9. [Dark Mode](#9-dark-mode)
10. [Responsive Breakpoints](#10-responsive-breakpoints)
11. [Accessibility](#11-accessibility)
12. [Icon System](#12-icon-system)

---

## 1. Design Philosophy

The site follows a **minimal, high-contrast, content-first** aesthetic.

- **Light mode** is clean white with black text — editorial, newspaper-like.
- **Dark mode** introduces a subtle green accent palette, giving a developer/terminal feel without being garish.
- Decoration is functional. Animations communicate state (navigation, hover, load) rather than existing purely for effect.
- Bento-card layouts replace traditional hero/banner patterns to show real data (GitHub stats) instead of stock imagery.
- Every page is responsive-first: mobile layouts are designed, then expanded for `md+`.

---

## 2. Color System

All colors are CSS custom properties defined in `app/globals.css` and mapped into the Tailwind v4 theme via `@theme {}`.

### 2.1 CSS Custom Properties

```css
/* Light Theme (:root) */
--bg-primary:       #ffffff;          /* page background */
--text-primary:     #000000;          /* headings, strong text */
--text-secondary:   #374151;          /* gray-700 — body copy */
--text-muted:       #6b7280;          /* gray-500 — captions, labels */
--nav-bg:           rgba(255,255,255,0.8);  /* frosted glass nav */
--border-primary:   #e5e7eb;          /* gray-200 — card borders */
--nav-border:       transparent;
--footer-bg:        #f9fafb;          /* gray-50 */
--hover-bg:         #f3f4f6;          /* gray-100 — interactive hover bg */
--primary:          #000000;
--primary-foreground: #ffffff;

/* Dark Theme (.dark) */
--bg-primary:       #000000;
--text-primary:     #ffffff;
--text-secondary:   #d1d5db;          /* gray-300 */
--text-muted:       #9ca3af;          /* gray-400 */
--nav-bg:           rgba(0,0,0,0.8);
--border-primary:   rgba(74,222,128,0.25);  /* green-400/25 — accent border */
--nav-border:       rgba(74,222,128,0.15);
--footer-bg:        #0a0a0a;
--hover-bg:         rgba(74,222,128,0.08);  /* green-400/8 — hover tint */
--accent-green:     #4ade80;          /* green-400 */
--accent-red:       #f87171;          /* red-400 */
--primary:          #ffffff;
--primary-foreground: #000000;
```

### 2.2 Tailwind Color Tokens

These are available in Tailwind class names (e.g., `bg-background`, `text-foreground`):

| Token | Maps to |
|---|---|
| `background` | `--bg-primary` |
| `foreground` | `--text-primary` |
| `text-secondary` | `--text-secondary` |
| `text-muted` | `--text-muted` |
| `nav-bg` | `--nav-bg` |
| `border-primary` | `--border-primary` |
| `nav-border` | `--nav-border` |
| `footer-bg` | `--footer-bg` |
| `hover-bg` | `--hover-bg` |
| `primary` | `--primary` |
| `primary-foreground` | `--primary-foreground` |

### 2.3 Accent Colors (Dark Mode Only)

| Use | Variable | Value |
|---|---|---|
| Links, active TOC, hover underlines | `--accent-green` | `#4ade80` (green-400) |
| Blog "view all" hover | `--accent-red` | `#f87171` (red-400) |
| Sponsor button | pink-500 / pink-600 | Hardcoded Tailwind classes |

> **Rule:** Never use raw color hex values in component code. Always use the CSS custom property or the Tailwind token. Exception: one-off Tailwind classes like `bg-red-50 dark:bg-red-900/20` for error states are acceptable.

---

## 3. Typography

### 3.1 Font Families

Loaded via `next/font/google` in `lib/fonts.ts` and applied as CSS variables on `<html>`:

| Variable | Font | Use |
|---|---|---|
| `--font-geist-sans` | Geist Sans | Default sans-serif — UI, body, nav, cards |
| `--font-geist-mono` | Geist Mono | Code blocks, inline code |
| `--font-playfair` | Playfair Display | Hero `<h1>` only — editorial display serif |

```tsx
// In layout.tsx — applied via className on <html>
className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable}`}
```

### 3.2 Type Scale

| Element | Size | Weight | Class |
|---|---|---|---|
| Hero H1 | `text-4xl` → `sm:text-5xl` | 500 (`font-medium`) | `font-[var(--font-playfair)]` |
| Section H2 | `text-3xl` | 700 (`font-bold`) | `tracking-tight` |
| Card H3 | `text-sm` | 500 | `uppercase tracking-wider` |
| Stat number | `text-3xl` → `md:text-4xl` | 700 | — |
| Body copy | `text-base` → `md:text-lg` | 400 | `text-text-muted` |
| Captions / labels | `text-xs`–`text-sm` | 400–600 | `text-text-muted` |
| Nav links | `text-sm` | 500 | `font-medium` |
| Footer column headings | `text-xs` | 600 | `uppercase tracking-widest` |

### 3.3 Prose (Blog/Project Content)

Blog and project content rendered via `HtmlParser` is wrapped in `.prose`. All `.prose` styles are fully custom in `globals.css` — **do not rely on `@tailwindcss/typography` defaults** as they are overridden.

Key prose values:

```
font-size:   1rem
line-height: 1.75
color:       --text-muted

h1: 1.875rem / fw 600
h2: 1.5rem   / fw 600
h3: 1.25rem  / fw 600
h4: 1.125rem / fw 600
```

Code blocks: `background: var(--hover-bg)`, `border-radius: 0.75rem`, monospace font.

---

## 4. Spacing & Layout

### 4.1 Page Gutter

Consistent horizontal padding on all page-level sections:

```
px-6           (24px)  — mobile
md:px-10       (40px)  — md+
```

### 4.2 Max Widths

| Context | Max Width |
|---|---|
| Content sections (home, blogs, projects) | `max-w-6xl` (72rem) |
| Footer inner | `max-w-7xl` (80rem) |
| Blog/Project detail prose | varies (typically `max-w-3xl`) |

### 4.3 Vertical Rhythm

Section vertical padding: `py-16` (64px top and bottom).

Bento grid gap: `gap-6`.

Footer padding: `py-12 md:py-16`.

### 4.4 Navbar Height

```css
--navbar-h: 96px;    /* mobile:  h-24 */
--navbar-h: 132px;   /* md+:     h-[132px] */
```

Content is offset by `--navbar-h` via a spacer `<div>` immediately after the fixed `<nav>`. Scroll padding is also set to `calc(var(--navbar-h) + 1rem)` for anchor links.

---

## 5. Borders & Shadows

### 5.1 Border Radius

| Component | Radius |
|---|---|
| Bento cards / Hero stat cards | `rounded-3xl` (24px) |
| Chat bubbles | `rounded-2xl` (16px) |
| Tooltips, dropdowns | `rounded-lg` / `rounded-xl` |
| Tags, pills | `rounded-full` |
| Code blocks | `rounded-xl` (12px) |
| Mobile menu TOC | `rounded-xl` |

### 5.2 Card Borders

Cards use `border border-border-primary`. In dark mode this renders as the subtle green `rgba(74,222,128,0.25)` border, giving a consistent accent without being distracting.

### 5.3 Shadows

| Use | Class |
|---|---|
| Resting card | `shadow-sm` |
| Card hover | `shadow-md` (via `hover:shadow-md transition-shadow`) |
| Chatbot sidebar | `shadow-2xl` |
| FAB button | `shadow-lg shadow-primary/30` |

> Cards animate from `shadow-sm` → `shadow-md` on hover with `transition-shadow`. This is the standard card hover effect — do not use `scale`, `translateY`, or other transforms on cards.

---

## 6. Animation & Motion

### 6.1 Duration & Easing Reference

| Use | Duration | Easing |
|---|---|---|
| Color / opacity transitions | `200ms` | `ease` (default) |
| Hover shadow on cards | `300ms` | default |
| Nav underline expand | `300ms` | default |
| Mobile menu appear | `300ms` | default |
| Mobile menu items (staggered) | `50ms` delay per item | default |
| Sponsor button fill (hover) | `300ms` | `ease-out` |
| Chatbot FAB scale | `300ms` | default |
| Chatbot sidebar slide | `300ms` | `ease-in-out` |
| Page transition (cloud) close | `1200ms` | `cubic-bezier(0.7, 0, 0.84, 0)` — decelerate in |
| Page transition (cloud) open | `1200ms` | `cubic-bezier(0.16, 1, 0.3, 1)` — spring out |
| Page transition (fast-path fade) | `250ms` | `ease` |

### 6.2 `slideUpFade` Animation

Used for entrance animations on page-load elements:

```css
@keyframes slideUpFade {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

.animate-slide-up-fade {
  animation: slideUpFade 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
```

### 6.3 Page Transition — CloudTransition

`CloudTransition` (`components/layout/CloudTransition.tsx`) is a custom page-transition system mounted globally in the root layout.

**Behavior:**
- **Fast navigations** (< ~100ms): A simple backdrop fade hides the DOM swap.
- **Slow navigations** (> ~100ms): Two "cloud" panels (top half and bottom half of the screen, using `bg-footer-bg`) sweep in from top and bottom to obscure content, wait until the new page is ready, then part to reveal it.

**Phases:** `hidden → fading → prepare → closing → closed → opening → hidden`

**Do not add additional page-transition libraries.** The CloudTransition is the sole transition mechanism.

### 6.4 Bar Chart (Hero Commits Graph)

The 28-day commit bar chart uses CSS `height` as a percentage of a flex container. Bars animate on hover from muted (`bg-border-primary`) to green (`dark:bg-[var(--accent-green)]`) via `transition-all duration-300`.

### 6.5 Scrollbar

Scrollbars are hidden globally on `html` and `body` (both `-webkit-scrollbar: none` and `scrollbar-width: none`). This includes the TOC sticky sidebar and mobile dropdown.

---

## 7. Component Patterns

### 7.1 Navbar

- **Position:** `fixed top-0`, `z-50`, full width.
- **Height:** `h-24 md:h-[132px]` (see `--navbar-h`).
- **Background:** `bg-nav-bg backdrop-blur-md` — frosted glass effect.
- **Border:** `border-b border-nav-border` (transparent in light, subtle green in dark).
- **Logo:** `/Logo.svg` as `next/image`, `dark:invert` filter (SVG inverts to white in dark mode).
- **Links:** Active state = `text-foreground` + `w-full` underline bar. Inactive = `text-text-muted hover:text-foreground` + `w-0 → w-full` underline on hover.
- **Sponsor button:** Pink-border pill, hover fills with `bg-pink-500` via `scale-x-0 → scale-x-100` span.
- **Mobile menu:** Full-page overlay (`fixed inset-0 z-40 bg-background`), items stagger in with 50ms delays. Hamburger animates to × (three bars with `rotate-45` / `opacity-0` / `-rotate-45`).

### 7.2 Footer

- **Background:** `bg-footer-bg border-t border-border-primary`.
- **Structure:** Logo + tagline + social icons | Pages | Projects | Blogs columns. Bottom bar with copyright + sitemap link.
- **Social icons:** `p-2.5 rounded-lg border border-border-primary hover:text-foreground hover:border-foreground hover:shadow-sm`.
- **Footer links:** `text-sm text-text-secondary hover:text-foreground` + trailing `›` that fades in on group hover.

### 7.3 Bento Cards (Hero)

Cards use a shared baseline style:

```jsx
className="bg-background p-6 md:p-8 rounded-3xl shadow-sm border border-border-primary hover:shadow-md transition-shadow"
```

- Stat label: `text-xs uppercase tracking-wider text-text-muted` with `react-icons` icon.
- Stat number: `text-3xl md:text-4xl font-bold text-foreground`.
- The commits card spans `row-span-3` on `md+` to house the bar chart.
- Grid: `grid-cols-1 md:grid-cols-2 gap-6 auto-rows-[minmax(110px,auto)]`.

### 7.4 Chatbot

- **FAB:** `fixed bottom-6 right-6 z-40`, round (`rounded-full`), `bg-primary text-primary-foreground`. Scales to 0 when open, scales to 1.1 on hover when closed.
- **Sidebar:** `fixed top-0 right-0 h-[100dvh] w-full sm:w-[400px]`, slides in from right (`translate-x-full → translate-x-0`), `shadow-2xl`.
- **Message bubbles:**
  - User: `bg-primary/10 border border-primary/20 rounded-br-sm` (right-aligned).
  - AI: `bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-bl-sm` (left-aligned).
  - Max width: 85% of sidebar width.
- **Input:** Rounded-full pill with send button, `focus-within:ring-1 focus-within:ring-primary`.
- **Loading:** Spinner (`animate-spin`) with "Thinking..." text.
- **Error bubble:** `bg-red-500/10 border border-red-500/20 text-red-400`.

### 7.5 Table of Contents (ToC)

- **Desktop** (`xl+`): Absolutely positioned sidebar `left: -14rem` (offset from article). Sticky within the article: `position: sticky; top: 6rem`.
- **Mobile** (< `xl`): Fixed floating button at `bottom: 1.5rem; left: 1.5rem`. Tapping opens a dropdown panel above the button.
- **Active link:** `border-left-color: var(--accent-green)` + `bg-hover-bg` + `font-weight: 500`.
- **Inactive link:** `color: var(--text-muted)`, `border-left: 2px solid transparent`.

### 7.6 ThemeToggle

Client component. Renders a toggle button that switches `next-themes` between `light` / `dark`. Use `<ThemeToggle />` — do not re-implement theme switching logic elsewhere.

### 7.7 Cards — BlogList / ProjectList

Client-rendered searchable grids. Cards use the same border + shadow pattern as bento cards but with `rounded-2xl` instead of `rounded-3xl`. Cover images use `next/image` with `object-cover`.

### 7.8 PushSettings

Floating push notification opt-in prompt. Rendered lazily via `LazyClientComponents`. Mounts only in browser after the page has loaded.

---

## 8. Page Patterns

### 8.1 Home (`/`)

1. `<Hero />` — intro text + GitHub bento grid (server component, ISR).
2. "Recent Writings" section — `BlogList` with `hideSearch` prop.
3. "Featured Projects" section — `ProjectList` with `hideSearch` prop.
4. "View all" link: desktop = inline right-aligned, mobile = centered pill button below list.

### 8.2 Blog / Project Detail Pages

- `<PageHeader />` — page title + breadcrumb.
- Cover image (if present) via `next/image`.
- `<ContentWithToc />` wraps `<HtmlParser />` (main content) + `<TableOfContents />`.
- `<BlogInteractions />` — star + comment section (client component).
- JSON-LD `BlogPosting` / `SoftwareApplication` schema in a `<script>` tag.

### 8.3 About Page

- `<ExperienceTimeline />` — chronological work history.
- `<FAQ />` — static Q&A with JSON-LD `FAQPage` schema.

### 8.4 Admin Pages

All admin pages are protected server components. Layout: `app/admin/layout.tsx` renders the `<AdminDashboard>` sidebar nav. Each section uses a consistent pattern:

```
/admin/<section>/page.tsx    → list view (server, table/grid)
/admin/<section>/new/        → create form
/admin/<section>/[id]/       → edit form
```

Forms: `BlogForm` / `ProjectForm` — use `TipTapEditor` for content, `MediaLibraryModal` for image selection, `DatePicker` for publish date.

### 8.5 Error / Not Found

- `app/error.tsx` — global error boundary with "Try again" button.
- `app/not-found.tsx` — 404 page with link back to home.

Both use `animate-slide-up-fade` for entrance.

---

## 9. Dark Mode

Dark mode is implemented via the `next-themes` library with `class` strategy. The `.dark` class is applied to `<html>`.

**Implementation:**
- `ThemeProvider` wraps the app inside `AppProviders`.
- All color tokens switch via `.dark { ... }` overrides in `globals.css`.
- The logo uses `dark:invert` to flip from dark SVG → white.
- The `CloudTransition` panels use `bg-footer-bg` which also adapts to dark (`#0a0a0a`).

**Key dark mode accent rules:**
- Borders glow subtly green (`rgba(74,222,128,0.25)`).
- Hover backgrounds tint green (`rgba(74,222,128,0.08)`).
- Nav border is a faint green line.
- Active TOC item uses `--accent-green` for the left border.
- Blog hover color is `--accent-red`; project hover color is `--accent-blue` (standard Tailwind `blue-*`).

> Do not use `bg-white` or `bg-black` directly in components — always use `bg-background` / `bg-foreground` so dark mode works correctly.

---

## 10. Responsive Breakpoints

Standard Tailwind breakpoints. Key decisions:

| Breakpoint | Key Changes |
|---|---|
| `sm` (640px) | Multi-column footer, smaller chatbot becomes fixed-width |
| `md` (768px) | Navbar height grows, desktop nav links appear, hamburger hidden, bento becomes 2-col, px increases |
| `lg` (1024px) | Footer columns go to a single row |
| `xl` (1280px) | Desktop ToC sidebar appears, mobile ToC button hidden |
| `1440px` | ToC sidebar shifts further left (`-16rem`, `14rem` wide) |

Mobile-first by default. Always write mobile styles first, then layer `md:` / `lg:` / `xl:` overrides.

---

## 11. Accessibility

- All interactive elements have `aria-label` attributes where text content is absent (FAB, hamburger, close button).
- Hamburger toggles `aria-label` between "Open menu" and "Close menu".
- Mobile menu overlay uses `aria-hidden="true"` on the backdrop click-trap.
- Images use descriptive `alt` text.
- `scroll-padding-top` is set to account for the fixed navbar so anchor links land correctly.
- Color contrast: light mode uses black on white (max contrast); dark mode uses white text on black — both WCAG AA+.
- Focus rings are handled by `focus-within:ring-1 focus-within:ring-primary` on the chat input form.

---

## 12. Icon System

Icons are sourced from `react-icons` v5. Preferred icon sets used in this project:

| Set | Prefix | Used for |
|---|---|---|
| Font Awesome 6 | `Fa`, `Fa6` | GitHub stats (star, fork, users), social platforms |
| Feather Icons | `Fi` | UI chrome (send, loader, message, X, git-commit) |

Platform-to-icon mapping for 60+ social platforms is centralized in `components/SocialIcons.tsx`. When adding a new social link to the admin, add the mapping there — don't inline platform-specific icon logic in other components.

Icon sizing conventions:

| Context | Size class |
|---|---|
| Inline with text / labels | `text-lg` → `text-xl` |
| Card icons | `text-xl` |
| Chat header / sidebar | `w-5 h-5` |
| Chat FAB | `w-6 h-6` |
| Social link icons | `w-4 h-4` |

---

## Appendix — Quick Reference

### Adding a New Card Component

```tsx
<div className="bg-background p-6 md:p-8 rounded-3xl shadow-sm border border-border-primary hover:shadow-md transition-shadow">
  {/* label */}
  <div className="flex items-center gap-2 mb-2 text-text-muted">
    <Icon className="text-xl" />
    <h3 className="font-medium text-xs uppercase tracking-wider">Label</h3>
  </div>
  {/* value */}
  <div className="text-3xl md:text-4xl font-bold text-foreground">
    {value}
  </div>
</div>
```

### Adding a New Page Section

```tsx
<section className="px-6 md:px-10 py-16">
  <div className="max-w-6xl mx-auto">
    <div className="flex justify-between items-end mb-10">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground mb-2">
          Section Title
        </h2>
        <p className="text-text-muted">Subtitle or description.</p>
      </div>
      {/* optional "view all" link — desktop */}
      <Link href="/path" className="hidden md:flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-foreground transition-colors">
        View all
        <ArrowIcon />
      </Link>
    </div>
    {/* content */}
  </div>
</section>
```

### DO / DON'T Summary

| ✅ DO | ❌ DON'T |
|---|---|
| Use `bg-background`, `text-foreground` etc. | Use `bg-white`, `bg-black` directly |
| Use `border-border-primary` on all cards | Use `border-gray-200` — not theme-aware |
| Use `rounded-3xl` for large cards | Mix border radii inconsistently |
| Use `transition-shadow hover:shadow-md` for card hover | Use `hover:scale-105` on cards |
| Use `text-text-muted` for secondary text | Use raw `text-gray-500` |
| Add icons from `react-icons/fi` or `react-icons/fa6` | Add new icon libraries |
| Check `SocialIcons.tsx` before adding a social icon | Inline `react-icons` platform icons in components |
| Use `slideUpFade` for entrance animations | Build one-off keyframe animations |
| Use `pnpm` | Use `npm` or `yarn` |

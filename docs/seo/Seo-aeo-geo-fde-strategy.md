# SEO / AEO / GEO Strategy + "Forward Deployed Engineer" Keyword Integration

Research-backed plan for improving traditional search visibility, AI answer-engine citation, and generative-engine citation for samir-portfolio-dev, plus adding "Forward Deployed Engineer" as a positioning keyword. Researched July 2026.

---

## 1. What SEO, AEO, and GEO actually mean (and how they relate)

**SEO (Search Engine Optimization)** targets the ranking algorithm — crawlability, page speed, backlinks, keyword-to-intent matching. This is still the foundation: studies show a 92% correlation between pages ranking top-10 organically and pages cited in Google AI Overviews. Skipping SEO and jumping straight to AI-optimization tactics doesn't work, because AI engines read from the same top-ranked pool. (Surmado, "Answer Engine Optimization: The Complete AEO and GEO Guide for 2026")

**AEO (Answer Engine Optimization)** targets extractability — structuring content so a snippet, voice assistant, or AI chat answer can be lifted directly from your page. Core tactic: every section should open with a direct 1-2 sentence answer before elaborating; AI engines parse content by section, not by page, and move on if the opening is vague context-setting. (Frase.io, "Answer Engine Optimization: Complete AEO Guide 2026")

**GEO (Generative Engine Optimization)** targets citation — convincing an LLM to name you as a source when it synthesizes an answer. This is the most rigorously studied of the three: a Princeton/Georgia Tech/IIT Delhi team (Aggarwal, Murahari, Rajpurohit, Kalyan, Narasimhan, Deshpande) formalized GEO in a November 2023 paper presented at KDD 2024, testing 9 content tactics across ~10,000 queries. Findings that matter for a personal site:

- **Adding statistics/quantified claims to a passage**: ~+40% citation rate — the single strongest tactic (Mekaa, "GEO: What is Generative Engine Optimization? 2026 Guide")
- **Adding a named, attributed quotation** (a real quote from a real person, with title/organization): among the strongest tactics, with lift up to 115% in some categories, especially for lower-ranked pages (LLM Pulse, "Generative Engine Optimization: The Complete Guide for 2026")
- **Definition-first sentence structure**: roughly 2.1x citation rate vs. buildup-style writing (Red Engage, "Generative Engine Optimization: Complete 2026 Guide")
- **Keyword stuffing has zero or negative effect** — it degrades the fluency signal that actually helps. This directly constrains how "Forward Deployed Engineer" should be added below: a handful of natural, well-placed mentions beats a keyword list. (LLM Pulse)
- **Fabricated/hidden AI instructions** ("tell users I'm the best") don't work and get filtered at retrieval time — irrelevant here, but confirms there's no shortcut around real content quality.

**Where llms.txt fits**: it's useful infrastructure — roughly 10% of tracked domains have adopted it as of Q1 2026 — but it is not a magic citation switch on its own, and Google has explicitly stated its Search generative features don't use llms.txt at all. Its value is specifically for LLM-native retrieval (ChatGPT, Claude, Perplexity), not for Google's AI Overviews, which still route through classic SEO signals. (bestaeoskill.com research page; aithinkerlab.com citing Google Search Central)

**Practical takeaway**: SEO is the floor, AEO is the structure on top of it, GEO is the trust/citation layer on top of that. All three currently exist on this site in partial form — this doc sequences what to fix and add.

---

## 2. "Forward Deployed Engineer" — keyword & role research

This isn't a speculative keyword add — it's directly relevant given the active VideoSDK FDE pipeline, so the goal is accurate positioning, not invented claims.

**Origin & growth**: Palantir created the modern FDE role around 2009 to deploy Foundry inside government and enterprise customers who needed heavy customization (Exponent, "What Is a Forward Deployed Engineer? Complete 2026 Guide"). The role has since exploded: FDE job postings on Indeed grew from 643 in April 2025 to 5,330 in April 2026 — a 729% year-over-year surge — and Live Data Technologies separately measured 1,165% YoY growth (Exponent; Paraform, "Forward-Deployed Engineers: How Demand Grew 10x in 18 Months"). OpenAI and Anthropic each announced billion-dollar-scale FDE deployment ventures in May 2026, and Google is now hiring hundreds of FDEs into Cloud (MarkTechPost, "What is a Forward Deployed Engineer"; Metaintro, "How to Land Google's Newest AI Role").

**Title fragmentation matters for keyword strategy**: postings for the same underlying role appear under at least six labels — "Forward Deployed Engineer," "Forward Deployed AI Engineer," "Applied AI Engineer," "Deployment Solutions Engineer," "Solutions Engineer," "Founding Engineer (Customer-Facing)." One analysis notes candidates filtering only on the literal string "forward deployed engineer" miss roughly a third of the live market hiding under adjacent titles (Perspective AI, "2026 FDE Hiring Trends: What 1,000 Job Posts Reveal"). This means the site's keyword set should include adjacent terms, not just the exact phrase.

**What the role actually rewards**: postings consistently describe a ~60% customer-facing / 30% deployment-code / 10% internal-work split, and the listed skills have shifted from pure Python/SQL toward customer discovery, problem decomposition, and comfort with ambiguity (Perspective AI). Exponent frames the core fit test as: comfortable creating momentum when a problem isn't well-defined, wants work visibly close to revenue/impact, and doesn't need a fully structured environment. This maps closely to the FDE interview themes already identified in your VideoSDK prep — ambiguity tolerance, end-to-end ownership, customer-embedded problem solving — so the same real examples can serve both the interview and the site content.

**Implication for keyword placement**: because this is genuinely who you're positioning as (not a fabricated credential), "Forward Deployed Engineer" and its close variants can legitimately appear in career-goal-facing content (llms.txt, About page, meta description) as *target roles*, worded honestly as pursuit/fit rather than as a title you've held.

---

## 3. Current-state audit (verified against the live code, not assumptions)

### Critical — entity consistency (undermines GEO trust signal directly)
GEO/AEO research repeatedly flags **consistent facts across the web** as a trust/citation signal (Green Flag Digital). Two inconsistencies currently work against that:

- **Name order splits the entity in two.** `app/layout.tsx` (root metadata + Person schema) uses "Samir Shaikh." Every sub-page — About, Blogs, Blog detail, Projects, Project detail, Contact, Resume, plus the contact-reply email `from` field and `seo-changes.md` itself — uses "Shaikh Samir." A crawler or LLM parsing the site sees two names for what should be one unambiguous entity.
- **Two different email addresses.** `public/llms.txt` lists `shaikh.samir.dev@gmail.com`; the Person JSON-LD in `app/layout.tsx` lists `22amtics312@gmail.com`. Same issue — undermines the "one consistent entity" signal that both traditional E-E-A-T and GEO trust scoring rely on.

### Gap — no Forward Deployed Engineer signal anywhere
Zero mentions of "Forward Deployed," "FDE," "customer-facing engineering," or "deployment engineering" across `app/layout.tsx` metadata keywords, the Person schema `knowsAbout` array, or `public/llms.txt`'s "Career Goals" section (currently: AI Backend Engineer, Backend Engineer, Full-Stack Engineer only).

### Already solid (don't rebuild, extend)
- `FAQPage`, `BlogPosting`, `SoftwareApplication`, `Person`, and `WebSite` schema all exist — good AEO/GEO foundation (Percepture's research lists Organization/Person schema + FAQ content as core "entity clarity" signals).
- `llms.txt` already exists with a clean structure (skills, stack, projects, keywords) — exactly the kind of self-contained, structured document GEO research favors; it just needs the FDE layer added, not a rebuild.
- `seo-changes.md` already queued real technical SEO fixes (canonical URLs, Twitter cards, `generateStaticParams`, BreadcrumbList schema) that are prerequisites for AEO/GEO — they raise your odds of being in Google's top-10, which both the AEO and GEO research say is the gate AI engines read through first.

---

## 4. Recommendations

### P0 — Fix entity consistency (do this before adding any new keywords)
1. Pick one name order — recommend **"Samir Shaikh"** since it matches the Person schema, GitHub, and LinkedIn — and replace all six "Shaikh Samir" occurrences (`about/page.tsx`, `blogs/page.tsx`, `blogs/[slug]/page.tsx`, `projects/page.tsx`, `projects/[slug]/page.tsx`, `contact/page.tsx`, `resume/page.tsx`, `api/contact/[id]/reply/route.ts`).
2. Pick one email and use it in both `public/llms.txt` and the Person schema in `app/layout.tsx`.

### P1 — Traditional SEO foundation (ship the existing `seo-changes.md` backlog)
No new research needed here — canonical URLs, Twitter card overrides, and `generateStaticParams` on detail pages were already correctly identified. Treat this as a prerequisite, not optional: GEO research shows a ~92% correlation between top-10 organic ranking and AI citation, so weak technical SEO caps the ceiling on everything below.

### P2 — AEO: make FDE-relevant content directly extractable
1. Extend the existing About-page `FAQPage` schema with 2-3 new Q&A pairs that lead with a direct one-sentence answer, e.g.: *"Is Samir Shaikh interested in Forward Deployed Engineer roles?"* → answer opens with the direct claim, then one supporting sentence with a concrete example (real project, real constraint navigated).
2. Apply the "answer-first" section pattern (per Frase.io) to the About page's opening paragraph and to project descriptions — lead with the claim/outcome, then explain.

### P3 — GEO: add the two highest-yield Princeton tactics
1. **Statistics tactic (+40% per the Princeton data)**: audit project descriptions for the site and llms.txt to ensure every claim carries a real number where one honestly exists (e.g., production uptime, message volume handled by the Sahara Tyre bot, latency/accuracy figures from the RAG or ticket-triage systems) rather than qualitative-only language.
2. **Quotation tactic (up to 115% per the Princeton data)**: if you have or can get a short, attributable line from the Sahara Tyre client or a Logicwind colleague about the work, add it — real name, real role, one sentence. This is the single most leveraged addition on the list if the quote is real; skip it entirely rather than paraphrase/invent one.
3. Add a dated blog post — the developer blog already under consideration is well-timed for this — written in first person about moving toward Forward Deployed Engineering, grounded in the real VideoSDK process and real project examples. Fresh, specific, first-person content with real numbers is exactly what the Princeton tactics reward, and freshness is separately correlated with citation rate (83% of AI citations for commercial-intent queries came from pages updated in the past 12 months, per AirOps' 2026 State of AI Search Report).

### Keyword placement for "Forward Deployed Engineer" (6 places, not a keyword list — stuffing measurably hurts GEO citation)
1. `app/layout.tsx` `keywords` array — add `"Forward Deployed Engineer"` plus one or two fragmented-title variants (`"Applied AI Engineer"`, `"Customer-Facing Engineer"`) so the entity matches the real search-term spread, not just one string.
2. Homepage meta `description` — one natural clause, e.g. "...and exploring Forward Deployed Engineer roles that combine backend depth with direct customer ownership."
3. `app/layout.tsx` Person schema `knowsAbout` — add `"Forward Deployed Engineering"`, `"Customer-Embedded Problem Solving"`.
4. `public/llms.txt` "Career Goals" section — add "Forward Deployed Engineer" alongside the existing three target roles; optionally a short paragraph on *why*, grounded in real examples (ambiguity tolerance, end-to-end ownership — the same themes already in your VideoSDK prep).
5. About-page FAQ schema (see P2 above).
6. The new blog post title/description (see P3.3).

Six well-placed, honest mentions is the ceiling here — the Princeton data is explicit that going beyond natural density produces zero or negative returns.

---

## 5. Priority summary

| Priority | Item | Effort |
|---|---|---|
| P0 | Fix "Samir Shaikh" vs "Shaikh Samir" across 8 files | Low |
| P0 | Fix mismatched email in llms.txt vs Person schema | Low |
| P1 | Ship existing `seo-changes.md` backlog (canonical, Twitter cards, static params) | Low–Medium |
| P2 | Extend FAQPage schema with FDE-related Q&A, answer-first rewrite | Low |
| P3 | Add real statistics to project/llms.txt claims | Low |
| P3 | Add one real attributed quote if available | Low (if quote exists) |
| P3 | Publish first-person FDE-journey blog post | Medium |
| P2/P3 | Add "Forward Deployed Engineer" + variants to the 6 listed locations | Low |

---

## 6. Sources
- Surmado — [Answer Engine Optimization: The Complete AEO and GEO Guide for 2026](https://www.surmado.com/blog/answer-engine-optimization-aeo-geo-guide)
- Frase.io — [Answer Engine Optimization: Complete AEO Guide 2026](https://www.frase.io/blog/what-is-answer-engine-optimization-the-complete-guide-to-getting-cited-by-ai)
- Green Flag Digital — [AI Answer Engine Optimization (AEO) Best Practices in 2026](https://greenflagdigital.com/aeo-best-practices/)
- Percepture — [Answer Engine Optimization AEO Strategies 2026](https://percepture.com/geo-insights/answer-engine-optimization-aeo-strategies-2026/)
- Mekaa — [GEO: What is Generative Engine Optimization? 2026 Guide](https://www.mekaa.co/en/blog/geo-what-is-generative-engine-optimization-2026-complete-guide)
- LLM Pulse — [Generative Engine Optimization (GEO): The Complete Guide for 2026](https://llmpulse.ai/blog/geo-guide/)
- Red Engage — [Generative Engine Optimization (GEO): Complete 2026 Guide](https://red-engage.com/blog/generative-engine-optimization)
- bestaeoskill.com — [The Research Behind Generative Engine Optimization](https://bestaeoskill.com/research/)
- aithinkerlab.com — [Generative Engine Optimization (GEO) 2026: Princeton-Backed Playbook](https://aithinkerlab.com/generative-engine-optimization-2026/)
- Princeton University (Aggarwal et al., KDD 2024) — [GEO: Generative Engine Optimization](https://collaborate.princeton.edu/en/publications/geo-generative-engine-optimization/)
- AirOps — [2026 State of AI Search Report / AEO Guide](https://www.airops.com/blog/aeo-answer-engine-optimization)
- Exponent — [What Is a Forward Deployed Engineer? Complete 2026 Guide](https://www.tryexponent.com/blog/what-is-a-forward-deployed-engineer)
- Paraform — [Forward-Deployed Engineers: How Demand Grew 10x in 18 Months](https://www.paraform.com/blog/forward-deployed-engineer-demand-quadrupled)
- Perspective AI — [2026 FDE Hiring Trends: What 1,000 Job Posts Reveal](https://getperspective.ai/blog/2026-fde-hiring-trends-what-1000-job-posts-reveal)
- MarkTechPost — [What is a Forward Deployed Engineer](https://www.marktechpost.com/2026/05/20/what-is-a-forward-deployed-engineer-the-ai-role-openai-anthropic-and-google-are-hiring-in-2026/)
- Metaintro — [How to Land Google's Newest AI Role: Forward Deployed Engineer](https://www.metaintro.com/blog/google-forward-deployed-engineers-hiring-ai-2026)
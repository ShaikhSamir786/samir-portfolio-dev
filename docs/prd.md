# Product Requirements Document (PRD) — Samir's Portfolio

> **Document Version:** 1.1  
> **Last Updated:** July 17, 2026  
> **Author:** Samir Shaikh  
> **Status:** Active Development

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Product Vision](#2-product-vision)
3. [Target Audience](#3-target-audience)
4. [Core Objectives](#4-core-objectives)
5. [Key Features](#5-key-features)
6. [Technical Architecture](#6-technical-architecture)
7. [User Personas](#7-user-personas)
8. [User Stories](#8-user-stories)
9. [Success Metrics](#9-success-metrics)
10. [Non-Functional Requirements](#10-non-functional-requirements)
11. [Constraints & Assumptions](#11-constraints--assumptions)
12. [Future Enhancements](#12-future-enhancements)
13. [Appendix](#13-appendix)

---

## 1. Executive Summary

**Samir's Portfolio** is a full-stack personal portfolio and blog website built with Next.js 16, designed to showcase Samir Shaikh's work as an AI Backend Engineer and Node.js Developer. The site serves as a professional online presence, combining a traditional portfolio with advanced features like an AI-powered chatbot, PWA capabilities, push notifications, and a fully managed blog system with comments and stars.

The platform is self-contained, with a comprehensive admin panel for content management, automated blog generation via GitHub Actions, and integration with modern services (Neon, Cloudinary, Vercel AI SDK) for scalability and performance.

---

## 2. Product Vision

### 2.1 Purpose

To create a modern, performant, and feature-rich portfolio website that:

- **Showcases expertise** in AI backend engineering, Node.js development, and full-stack capabilities
- **Demonstrates technical proficiency** through the implementation of advanced features (AI chatbot, RAG, PWA, push notifications)
- **Provides a content platform** for technical writing and thought leadership
- **Serves as a professional landing page** for career opportunities, freelance inquiries, and industry connections
- **Acts as a living resume** with dynamic content management

### 2.2 Key Differentiators

1. **AI-Powered Interactivity**: Built-in chatbot with RAG (Retrieval-Augmented Generation) using vector search, providing visitors with an intelligent assistant that can answer questions about Samir's work
2. **Automated Content Pipeline**: GitHub Actions workflow generates blog posts every 3 days using Groq AI, grounded in the site's content (llms.txt), ensuring fresh, relevant content
3. **Full Admin Control**: Comprehensive dashboard for managing all content (blogs, projects, experience, media, notifications) without code changes
4. **Modern Architecture**: Serverless database (Neon), edge-ready deployment (Vercel), and optimized performance with ISR and image optimization
5. **PWA Capabilities**: Installable as a Progressive Web App with push notification support for blog updates

---

## 3. Target Audience

### 3.1 Primary Audience

| Segment | Description | Primary Needs | SEO / GEO Intent |
|---------|-------------|---------------|------------------|
| **Technical Recruiters & Hiring Managers** | Recruiters at startups, product companies, enterprises, and consulting firms | Quickly evaluate technical skills, work experience, resume, projects, and contact information | "Backend Developer Portfolio", "Node.js Developer", "Full Stack Developer", "Hire Backend Developer" |
| **Engineering Managers & CTOs** | Technical decision makers evaluating candidates | Assess architecture skills, code quality, system design knowledge, scalability, leadership potential, and project complexity | "Node.js Engineer", "System Design Portfolio", "Backend Architecture", "Microservices Developer" |
| **Potential Clients** | Startups, SaaS companies, agencies, and businesses looking for freelance or contract work | Portfolio, technical capabilities, service offerings, previous work, pricing, and contact options | "Hire Node.js Developer", "Freelance Backend Developer", "Custom Web Development", "API Development Services" |
| **Software Engineers & Developers** | Backend engineers, full-stack developers, DevOps engineers, AI engineers | Technical blogs, project architecture, open-source work, GitHub repositories, implementation details, best practices | "Node.js Tutorials", "TypeScript Projects", "NestJS", "GraphQL", "System Design" |

### 3.2 Secondary Audience

| Segment | Description | Needs | SEO / GEO Intent |
|---------|-------------|-------|------------------|
| **AI Enthusiasts** | Developers interested in practical AI implementation | AI integrations, RAG systems, LLM applications, automation projects | "AI Projects", "LLM Integration", "OpenAI APIs", "RAG Systems" |
| **Students & Aspiring Developers** | Individuals learning backend development | Learning resources, project walkthroughs, career guidance, technical blogs | "Learn Node.js", "Backend Projects", "Developer Portfolio Inspiration" |
| **Open Source Community** | Developers exploring reusable solutions | GitHub repositories, reusable libraries, documentation, contribution opportunities | "Open Source Node.js", "GitHub Portfolio" |
| **Professional Network** | Colleagues, founders, recruiters, and connections | Professional profile, achievements, certifications, networking opportunities | "Backend Engineer Portfolio", "Software Engineer India" |

### 3.3 Geographic & Demographic Focus

#### Primary Hiring Markets

- United States
- Canada
- United Kingdom
- Germany
- Netherlands
- Australia
- Singapore
- India

#### Secondary Markets

- Europe
- Middle East
- Southeast Asia
- Remote-first Companies Worldwide

#### Languages

- English (Primary)
- Future multilingual support

#### Device Strategy

- Mobile-first
- Desktop optimized
- Tablet responsive

#### Accessibility

- WCAG 2.2 AA Compliance
- Keyboard Navigation
- Screen Reader Friendly
- Semantic HTML

---

## 4. Core Objectives

### 4.1 Business Objectives

| Objective | Priority | Success Indicator |
|-----------|----------|-------------------|
| Establish a professional online presence | Critical | Portfolio indexed, optimized, and fully populated |
| Generate interview opportunities | Critical | Recruiter inquiries, interview invitations, profile visits |
| Attract freelance and consulting clients | High | Contact form submissions, project inquiries |
| Demonstrate backend engineering expertise | Critical | High engagement on portfolio projects and GitHub |
| Build technical authority | High | Organic traffic, blog readership, backlinks, social shares |
| Showcase production-ready projects | High | Increased project views and repository engagement |
| Publish technical knowledge consistently | Medium | Blog traffic, newsletter subscriptions, returning visitors |
| Maintain a scalable content platform | Critical | Fully functional admin panel and CMS |

### 4.2 Technical Objectives

| Objective | Priority | Success Indicator |
|-----------|----------|-------------------|
| Achieve excellent Core Web Vitals | Critical | Lighthouse scores >90, LCP <2.5s, FID <100ms |
| Implement AI-powered features | High | Chatbot functional with accurate responses |
| Ensure scalability | Medium | Handles traffic spikes without degradation |
| Maintain security | Critical | No vulnerabilities, proper auth implementation |
| Enable automated content | Medium | Blog pipeline runs unattended successfully |

### 4.3 User Experience Objectives

| Objective | Priority | Success Indicator |
|-----------|----------|-------------------|
| Fast page loads | Critical | <3s initial load on 3G networks |
| Intuitive navigation | High | Users find information within 3 clicks |
| Mobile responsiveness | Critical | Functional on all device sizes |
| Dark/light mode support | Medium | Seamless theme switching |
| Accessibility compliance | High | WCAG AA+ certification |

### 4.4 SEO Objectives

The portfolio should rank for searches related to:

#### Primary Keywords

- Backend Developer Portfolio
- Node.js Developer
- Node.js Engineer
- Backend Engineer
- Full Stack Developer
- MERN Stack Developer
- TypeScript Developer
- Software Engineer Portfolio

#### Secondary Keywords

- Express.js Developer
- NestJS Developer
- React Developer
- Next.js Portfolio
- GraphQL Developer
- PostgreSQL Developer
- MongoDB Developer
- REST API Developer

#### Long-Tail Keywords

- Hire Node.js Developer
- Backend Developer Portfolio India
- Freelance Backend Developer
- Backend Developer with TypeScript
- Backend Engineer Portfolio Website
- Node.js API Developer
- Backend Developer Open to Work
- Junior Backend Developer Portfolio

#### Technical Keywords

- Microservices
- Docker
- Redis
- BullMQ
- Kafka
- CI/CD
- OpenTelemetry
- Prometheus
- Grafana
- System Design
- Distributed Systems
- Event Driven Architecture

### 4.5 AEO (Answer Engine Optimization)

The website should answer common recruiter and employer questions.

Generate optimized content for questions such as:

- Who is Samir Shaikh?
- What technologies does Samir specialize in?
- What projects has Samir built?
- Does Samir have Node.js experience?
- What backend technologies does Samir know?
- Has Samir worked with AI?
- What databases has Samir used?
- Is Samir available for freelance work?
- Where is Samir located?
- How can I contact Samir?

Each answer should be concise, structured, and optimized for Google Featured Snippets, AI Overviews, ChatGPT, Gemini, Claude, and Perplexity.

### 4.6 GEO (Generative Engine Optimization)

The portfolio should establish strong entity relationships so AI models can confidently recommend Samir Shaikh.

Include clear entity associations between:

- Samir Shaikh
- Backend Developer
- Full Stack Developer
- Node.js
- Express.js
- TypeScript
- React
- Next.js
- NestJS
- GraphQL
- PostgreSQL
- MongoDB
- Docker
- Redis
- BullMQ
- Kafka
- OpenTelemetry
- Prometheus
- Grafana
- AI Development
- RAG Systems
- LLM Integration
- REST APIs
- Microservices
- Software Architecture
- System Design

Demonstrate expertise through:

- Technical case studies
- Architecture diagrams
- Implementation details
- Performance optimizations
- Code examples
- Technical blogs
- Open-source contributions
- GitHub activity
- Engineering best practices

### 4.7 Technical SEO Objectives

Every page should include:

- Unique SEO Title
- Meta Description
- Canonical URL
- Open Graph Metadata
- Twitter Cards
- Breadcrumbs
- JSON-LD
- Person Schema
- Organization Schema (Personal Brand)
- Website Schema
- BlogPosting Schema
- Project Schema (CreativeWork / SoftwareSourceCode where applicable)
- FAQ Schema
- Breadcrumb Schema

### 4.8 Performance Objectives

- Core Web Vitals optimized
- Lighthouse Score >95
- Fast LCP
- Low CLS
- Optimized INP
- Image Optimization
- Font Optimization
- Static Generation where possible
- Dynamic Metadata using Next.js App Router
- Sitemap
- Robots.txt
- RSS Feed
- Semantic HTML
- Accessibility-first implementation

### 4.9 SEO & AI Search Success Metrics

> These objective-level targets complement the detailed measurement plan in [Section 9. Success Metrics](#9-success-metrics).

| Metric | Target |
|--------|--------|
| Google Indexed Pages | 100% |
| Lighthouse Performance | 95+ |
| Lighthouse SEO | 100 |
| Lighthouse Accessibility | 100 |
| Recruiter Contact Requests | Increasing month-over-month |
| Interview Invitations | Increasing month-over-month |
| GitHub Profile Clicks | High engagement |
| Portfolio Project Views | High engagement |
| Organic Search Traffic | Continuous growth |
| AI Search Visibility | Featured in AI-generated answers for relevant developer queries |
| Returning Visitors | Increasing trend |

---

## 5. Key Features

### 5.1 Public-Facing Features

#### 5.1.1 Homepage
- **Hero Section**: Dynamic GitHub stats display with commit activity visualization
- **Featured Content**: Rotating showcase of recent blog posts and projects
- **Quick Navigation**: Direct links to key sections
- **Social Proof**: GitHub stats, contribution graphs, and technology badges

#### 5.1.2 Blog System
- **Searchable Grid**: Filterable blog list with search functionality
- **Rich Content**: HTML-based posts with syntax highlighting and media support
- **Interactions**: Star ratings and comment system (JSONB-based)
- **SEO Optimization**: Dynamic metadata, structured data (BlogPosting schema)
- **Table of Contents**: Auto-generated navigation for long posts

#### 5.1.3 Project Portfolio
- **Searchable Grid**: Filterable project list with technology tags
- **Detailed Views**: Case study-style project pages with images and descriptions
- **SEO Optimization**: Structured data (SoftwareApplication schema)
- **Technology Showcase**: Visual representation of tech stacks used

#### 5.1.4 About Page
- **Experience Timeline**: Chronological work history with company logos
- **FAQ Section**: Common questions with structured data (FAQPage schema)
- **Skills Overview**: Technical proficiencies and specializations

#### 5.1.5 Contact System
- **Contact Form**: Public submission with validation
- **Admin Dashboard**: Message management with read/reply functionality
- **Email Integration**: Nodemailer for automated responses

#### 5.1.6 Resume Viewer
- **PDF Display**: Embedded PDF viewer using react-pdf
- **Download Option**: Direct download capability
- **Dynamic Updates**: Admin-managed resume URL

#### 5.1.7 AI Chatbot
- **Floating Interface**: Accessible via FAB button
- **RAG-Powered**: Vector search for accurate responses about Samir's work
- **Streaming Responses**: Real-time AI interaction
- **Security**: Rate limiting and VPN/proxy blocking
- **Fingerprinting**: Visitor identification for personalization

#### 5.1.8 PWA & Push Notifications
- **Installable**: Progressive Web App with offline support
- **Push Notifications**: Blog post updates and announcements
- **Subscription Management**: Topic-based notification preferences
- **Admin Compose**: Dashboard for creating and sending notifications

### 5.2 Admin Features

#### 5.2.1 Content Management
- **Blog Management**: Create, edit, publish/unpublish posts
- **Project Management**: CRUD operations for portfolio projects
- **Experience Management**: Accordion-based CRUD with drag-and-drop reorder
- **Media Library**: Image upload, organization, and selection
- **Social Links**: Platform-specific icon picker with reorder capability

#### 5.2.2 Rich Text Editing
- **TipTap Editor**: WYSIWYG editing with support for:
  - Bold, italic, underline, strikethrough
  - Headings (H1-H4)
  - Ordered/unordered lists
  - Blockquotes
  - Code blocks with syntax highlighting
  - Links and images
  - Media library integration

#### 5.2.3 Notification Management
- **Compose Interface**: Create push notifications with rich content
- **Subscriber List**: View and manage notification subscribers
- **Delivery Logs**: Track notification success/failure rates
- **Topic Management**: Organize subscribers by interest areas

#### 5.2.4 Contact Management
- **Message Inbox**: List of received messages with read status
- **Reply Modal**: Direct response interface
- **Email Integration**: Automated email replies via Nodemailer

### 5.3 Technical Features

#### 5.3.1 Authentication & Authorization
- **GitHub OAuth**: Social login for admin access
- **Credentials Auth**: Username/password fallback
- **Session Management**: Secure session handling with NextAuth v5
- **Route Protection**: Server and client component auth guards
- **API Protection**: Middleware-based route validation

#### 5.3.2 SEO & Discoverability
- **Dynamic Metadata**: Page-specific titles, descriptions, and OG tags
- **Structured Data**: JSON-LD schemas (Person, BlogPosting, SoftwareApplication, FAQPage)
- **Sitemap Generation**: Dynamic XML sitemap with all published content
- **Robots Configuration**: Proper crawl directives
- **Canonical URLs**: Duplicate content prevention

#### 5.3.3 Performance Optimization
- **ISR (Incremental Static Regeneration)**: 1-hour revalidation for all public pages
- **Image Optimization**: next/image with Cloudinary integration
- **Font Optimization**: Self-hosted fonts with next/font
- **Code Splitting**: Dynamic imports for heavy components
- **Caching Strategies**: Browser and CDN caching

#### 5.3.4 Security
- **Environment Variables**: All secrets in .env (never committed)
- **Auth Validation**: Session-based protection for admin routes
- **Input Validation**: Server-side validation for all API endpoints
- **Rate Limiting**: In-memory rate limiting for chatbot
- **CSRF Protection**: Built-in Next.js security features

#### 5.3.5 Automation
- **Blog Pipeline**: GitHub Actions workflow for automated content generation
- **Quality Gates**: Word count validation before publishing
- **Push Notifications**: Automated alerts for new blog posts
- **RAG Reindexing**: Automatic vector store updates on content changes

---

## 6. Technical Architecture

### 6.1 Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Framework** | Next.js 16 (App Router) | React-based full-stack framework |
| **UI** | React 19, TypeScript 5 | Component library and type safety |
| **Styling** | Tailwind CSS v4, @tailwindcss/typography | Utility-first CSS with prose styling |
| **Database** | Neon (Serverless PostgreSQL) | Scalable, serverless relational database |
| **ORM** | Drizzle ORM + pgvector | Type-safe queries with vector search |
| **Auth** | NextAuth v5 | GitHub OAuth + Credentials provider |
| **AI/ML** | Vercel AI SDK (@ai-sdk/google, @ai-sdk/groq) | Chat and embeddings |
| **Media** | Cloudinary, sharp | Image hosting and optimization |
| **PWA** | Serwist | Service worker and push notifications |
| **Email** | Nodemailer (SMTP) | Transactional emails |
| **Package Manager** | pnpm | Fast, disk-efficient package manager |

### 6.2 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (Browser)                      │
├─────────────────────────────────────────────────────────────┤
│  Next.js App Router (React 19, TypeScript)                 │
│  ├── Server Components (ISR, direct DB queries)            │
│  ├── Client Components (fetch API, state management)       │
│  ├── Tailwind CSS v4 (responsive, dark/light mode)         │
│  └── PWA (Serwist service worker, push notifications)      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     API Layer (Next.js)                     │
├─────────────────────────────────────────────────────────────┤
│  14 API Route Groups (25 route.ts files)                   │
│  ├── Authentication (NextAuth v5)                          │
│  ├── CRUD Operations (Blogs, Projects, Experience, etc.)   │
│  ├── AI Chat (Streaming, RAG, Rate Limiting)               │
│  ├── Media Management (Cloudinary integration)             │
│  ├── Push Notifications (web-push, subscriptions)          │
│  └── Automation (Blog generation, RAG reindexing)          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     Data Layer                              │
├─────────────────────────────────────────────────────────────┤
│  Neon PostgreSQL (Serverless)                              │
│  ├── 12 Tables (blogs, projects, experiences, etc.)        │
│  ├── pgvector (3072d embeddings for RAG)                   │
│  └── Drizzle ORM (type-safe queries)                       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     External Services                       │
├─────────────────────────────────────────────────────────────┤
│  ├── Cloudinary (image hosting/optimization)               │
│  ├── Vercel AI SDK (Groq chat, Google embeddings)          │
│  ├── GitHub API (stats, events, automation)                │
│  ├── Nodemailer (SMTP email delivery)                      │
│  └── IPinfo (VPN/proxy detection)                          │
└─────────────────────────────────────────────────────────────┘
```

### 6.3 Data Flow

#### Server-Side Rendering (SSR/ISR)
```
User Request → Next.js Server → Drizzle ORM → Neon DB → Response
                ↓
        ISR Cache (1 hour)
```

#### Client-Side Fetching
```
User Interaction → React Component → fetch("/api/...") → API Route → Drizzle ORM → Neon DB
                                       ↓
                              JSON Response → State Update → UI Re-render
```

#### AI Chat Flow
```
User Message → Chatbot UI → POST /api/chat → Vercel AI SDK → Groq Model
                                        ↓
                              RAG Pipeline (Vector Search)
                                        ↓
                              Context Retrieval → Prompt Construction → Streaming Response
```

#### Blog Automation Flow
```
GitHub Actions (every 3 days) → scripts/generate-blog.mjs
                                        ↓
                              Groq AI (grounded in llms.txt)
                                        ↓
                              Markdown → HTML (rehype-sanitize)
                                        ↓
                              POST /api/blogs → Neon DB
                                        ↓
                              POST /api/push/send → Web Push Subscribers
```

### 6.4 Database Schema

12 tables covering all application needs:

| Table | Purpose | Key Features |
|-------|---------|--------------|
| `admin_users` | Admin credentials | Defined but unused (auth via env vars) |
| `projects` | Portfolio projects | slug, technologies[], is_published |
| `blogs` | Blog posts | slug, stars, comments (JSONB), is_published |
| `about` | Personal description | Single row, no ID |
| `resume` | Resume URL | Single row |
| `contact` | Contact form submissions | name, email, subject, message, seen |
| `socials` | Social media links | name, url, display_order |
| `experiences` | Work history | company, position, dates, pay, is_current |
| `media` | Uploaded images | url, public_id (Cloudinary) |
| `content_chunks` | RAG embeddings | source_id, chunk_text, embedding (3072d vector) |
| `push_subscriptions` | Push notification subscribers | endpoint, subscription_json, topic |
| `sent_notifications` | Notification logs | title, body, success_count |

### 6.5 API Structure

25 route files across 14 groups:

| Route Group | Methods | Purpose |
|-------------|---------|---------|
| `/api/about` | GET, PUT | Personal description management |
| `/api/auth/[...nextauth]` | GET, POST | Authentication handlers |
| `/api/blogs` | GET, POST, PATCH, DELETE | Blog CRUD + star/comment |
| `/api/chat` | POST | AI chat with streaming |
| `/api/contact` | POST, GET, PATCH | Contact form + admin management |
| `/api/experience` | GET, PUT | Work history (bulk replace) |
| `/api/media` | GET, DELETE | Image library management |
| `/api/pdf-proxy` | GET | CORS proxy for PDFs |
| `/api/projects` | GET, POST, PATCH, DELETE | Project CRUD |
| `/api/push` | POST, GET | Push notifications |
| `/api/rag` | POST | Vector store reindexing |
| `/api/resume` | GET, PUT | Resume URL management |
| `/api/socials` | GET, PUT | Social links (bulk replace) |
| `/api/upload` | POST | Image upload to Cloudinary |

---

## 7. User Personas

### 7.1 Persona 1: Technical Recruiter (Primary)

**Name:** Sarah Chen  
**Role:** Senior Technical Recruiter at a Series B startup  
**Goals:**
- Quickly assess if Samir is a good fit for a Senior Backend Engineer role
- Find concrete examples of AI/ML implementation experience
- Get contact information for scheduling an interview

**Pain Points:**
- Generic portfolios without technical depth
- Outdated or incomplete project descriptions
- Difficulty finding contact information

**How the Site Helps:**
- Hero section with GitHub stats provides immediate credibility
- Blog posts demonstrate technical writing and thought leadership
- Project portfolio shows real-world implementation experience
- AI chatbot can answer specific questions about Samir's work
- Contact form provides direct communication channel

**User Journey:**
1. Lands on homepage → sees GitHub stats and recent projects
2. Clicks on a project → reads detailed case study
3. Visits About page → reviews experience timeline
4. Uses AI chatbot → asks about specific technologies used
5. Submits contact form → requests interview

### 7.2 Persona 2: Engineering Manager (Primary)

**Name:** Michael Rodriguez  
**Role:** Engineering Manager at a Fortune 500 company  
**Goals:**
- Evaluate Samir's technical depth and architecture decisions
- Assess communication skills through blog writing
- Determine cultural fit and growth potential

**Pain Points:**
- Portfolios that only show "what" without explaining "why"
- Lack of technical depth in project descriptions
- No evidence of continuous learning or knowledge sharing

**How the Site Helps:**
- Blog posts explain technical decisions and trade-offs
- Project pages detail architecture choices and outcomes
- FAQ section addresses common technical questions
- GitHub activity shows consistent contribution pattern

**User Journey:**
1. Reads blog post about RAG implementation
2. Reviews project page for the AI chatbot
3. Checks About page for experience and skills
4. Downloads resume for detailed review
5. Shares portfolio with team for feedback

### 7.3 Persona 3: Fellow Developer (Secondary)

**Name:** Priya Patel  
**Role:** Full-stack developer interested in AI  
**Goals:**
- Learn from Samir's implementation approaches
- Find inspiration for personal projects
- Connect for potential collaboration

**Pain Points:**
- Theoretical articles without practical examples
- No code snippets or implementation details
- Difficulty finding similar projects for reference

**How the Site Helps:**
- Technical blog posts with real-world examples
- Project pages with technology stacks and approaches
- GitHub stats show active development patterns
- Contact information for networking

**User Journey:**
1. Discovers blog post via search or social share
2. Reads through technical implementation details
3. Explores related projects
4. Checks GitHub profile for code examples
5. Reaches out for collaboration or questions

### 7.4 Persona 4: Potential Client (Secondary)

**Name:** David Kim  
**Role:** Startup founder needing backend development  
**Goals:**
- Find a skilled developer for a contract project
- Assess reliability and professional conduct
- Review past work quality and client satisfaction

**Pain Points:**
- Portfolios without clear service offerings
- No pricing or availability information
- Difficulty assessing work quality from screenshots alone

**How the Site Helps:**
- Project portfolio demonstrates capability
- Blog posts show professionalism and expertise
- Contact form enables direct inquiry
- AI chatbot can answer questions about services

**User Journey:**
1. Lands on homepage → sees professional presentation
2. Reviews project portfolio → finds relevant experience
3. Reads blog posts → assesses communication style
4. Uses chatbot → asks about availability and rates
5. Submits contact form → initiates project discussion

---

## 8. User Stories

### 8.1 Public Visitor Stories

#### Discovery & Navigation
- **As a visitor**, I want to quickly understand what Samir does, **so that** I can decide if his skills match my needs
- **As a visitor**, I want to navigate between sections easily, **so that** I can find specific information without confusion
- **As a mobile visitor**, I want the site to work well on my phone, **so that** I can browse without switching to desktop

#### Content Consumption
- **As a visitor**, I want to read blog posts with good formatting, **so that** I can understand technical concepts clearly
- **As a visitor**, I want to see project details with images, **so that** I can evaluate Samir's work quality
- **As a visitor**, I want to search/filter content, **so that** I can find relevant information quickly

#### Interaction
- **As a visitor**, I want to ask questions via chatbot, **so that** I can get immediate answers about Samir's work
- **As a visitor**, I want to star blog posts I like, **so that** I can show appreciation
- **As a visitor**, I want to leave comments, **so that** I can engage with the content
- **As a visitor**, I want to subscribe to notifications, **so that** I can stay updated on new content

### 8.2 Admin (Samir) Stories

#### Content Management
- **As an admin**, I want to create blog posts with a rich editor, **so that** I can publish well-formatted content
- **As an admin**, I want to manage projects easily, **so that** I can keep my portfolio current
- **As an admin**, I want to update my experience, **so that** my resume stays accurate
- **As an admin**, I want to upload images via a media library, **so that** I can manage visual content efficiently

#### User Management
- **As an admin**, I want to read contact messages, **so that** I can respond to inquiries
- **As an admin**, I want to reply to messages directly, **so that** I can maintain communication
- **As an admin**, I want to view notification subscribers, **so that** I can understand my audience

#### Automation
- **As an admin**, I want automated blog generation, **so that** I can maintain consistent content output
- **As an admin**, I want push notifications for new posts, **so that** subscribers are informed
- **As an admin**, I want RAG to auto-reindex, **so that** the chatbot always has current information

### 8.3 System Stories

#### Performance
- **As the system**, I want to serve cached pages, **so that** users get fast load times
- **As the system**, I want to optimize images, **so that** bandwidth is minimized
- **As the system**, I want to handle traffic spikes, **so that** the site remains available

#### Security
- **As the system**, I want to protect admin routes, **so that** unauthorized access is prevented
- **As the system**, I want to validate all inputs, **so that** injection attacks are blocked
- **As the system**, I want to rate-limit requests, **so that** abuse is prevented

#### Scalability
- **As the system**, I want to use serverless functions, **so that** scaling is automatic
- **As the system**, I want to use a serverless database, **so that** storage scales with demand
- **As the system**, I want to cache responses, **so that** database load is reduced

---

## 9. Success Metrics

### 9.1 Engagement Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Monthly unique visitors | 1,000+ | Google Analytics |
| Average session duration | >2 minutes | Google Analytics |
| Pages per session | >3 | Google Analytics |
| Blog post views | >100/month | Analytics |
| Project page views | >50/month | Analytics |
| Chatbot interactions | >50/month | Custom logging |
| Push notification subscribers | 100+ | Database count |

### 9.2 Conversion Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Contact form submissions | >10/month | Database count |
| Resume downloads | >20/month | Custom tracking |
| Blog post stars | >5/post average | Database count |
| Blog post comments | >2/post average | Database count |
| Social media shares | >10/month | Social analytics |

### 9.3 Technical Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Lighthouse Performance score | >90 | Lighthouse CI |
| Largest Contentful Paint (LCP) | <2.5s | Core Web Vitals |
| First Input Delay (FID) | <100ms | Core Web Vitals |
| Cumulative Layout Shift (CLS) | <0.1 | Core Web Vitals |
| Time to First Byte (TTFB) | <200ms | Core Web Vitals |
| API response time | <200ms (p95) | Monitoring |
| Uptime | 99.9% | Vercel status |

### 9.4 SEO Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Google indexing | 100% of public pages | Search Console |
| Organic traffic | >500/month | Google Analytics |
| Keyword rankings | Top 10 for "Samir Shaikh" | Search Console |
| Backlinks | >10 domains | Ahrefs/SEMrush |
| Rich snippets | Featured in AI Overviews | Manual monitoring |

### 9.5 Content Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Blog posts published | >12/year | Admin dashboard |
| Average post length | >1,000 words | CMS analytics |
| Post freshness | <30 days since last post | CMS analytics |
| Content accuracy | 0 outdated projects | Manual audit |

---

## 10. Non-Functional Requirements

### 10.1 Performance

| Requirement | Target | Implementation |
|-------------|--------|----------------|
| Page load time | <3s on 3G | ISR, image optimization, code splitting |
| Time to Interactive | <5s on 3G | Lazy loading, dynamic imports |
| Bundle size | <200KB initial | Tree shaking, code splitting |
| Image optimization | WebP/AVIF formats | Cloudinary, next/image |
| Font loading | FOUT prevention | next/font, font-display: swap |

### 10.2 Scalability

| Requirement | Target | Implementation |
|-------------|--------|----------------|
| Concurrent users | 1,000+ | Vercel edge functions, ISR caching |
| Database connections | 100+ | Neon serverless, connection pooling |
| API requests | 10,000/hour | Rate limiting, caching |
| Storage | 10GB images | Cloudinary optimization |
| Bandwidth | 100GB/month | CDN, image optimization |

### 10.3 Security

| Requirement | Target | Implementation |
|-------------|--------|----------------|
| Authentication | Session-based | NextAuth v5 |
| Authorization | Role-based | Server/client guards |
| Data encryption | TLS 1.3 | Vercel, Neon |
| Input validation | Server-side | Zod, Drizzle |
| CSRF protection | Enabled | Next.js built-in |
| Rate limiting | 5 requests/day (chat) | In-memory (TODO: Redis) |

### 10.4 Accessibility

| Requirement | Target | Implementation |
|-------------|--------|----------------|
| WCAG compliance | AA+ | Semantic HTML, ARIA labels |
| Keyboard navigation | Full support | Focus management |
| Screen reader support | Full | Semantic markup, alt text |
| Color contrast | 4.5:1 minimum | Theme variables |
| Motion preferences | Respected | prefers-reduced-motion |

### 10.5 Reliability

| Requirement | Target | Implementation |
|-------------|--------|----------------|
| Uptime | 99.9% | Vercel, Neon SLAs |
| Backup frequency | Daily | Neon automated backups |
| Recovery time | <1 hour | Vercel instant rollback |
| Error rate | <0.1% | Monitoring, error boundaries |

### 10.6 Maintainability

| Requirement | Target | Implementation |
|-------------|--------|----------------|
| Code coverage | >70% | Jest, React Testing Library |
| Documentation | Complete | README, CONTEXT.md, docs/ |
| Type safety | 100% TypeScript | Strict mode |
| Linting | Zero errors | ESLint, Prettier |
| Dependency updates | Monthly | Dependabot, pnpm update |

### 10.7 Compatibility

| Requirement | Target | Implementation |
|-------------|--------|----------------|
| Browser support | Chrome, Firefox, Safari, Edge (latest 2 versions) | Babel, PostCSS |
| Mobile support | iOS 14+, Android 10+ | Responsive design, PWA |
| Screen sizes | 320px - 2560px | Tailwind breakpoints |
| Network conditions | 3G+ | Optimistic UI, caching |

---

## 11. Constraints & Assumptions

### 11.1 Constraints

| Constraint | Impact | Mitigation |
|------------|--------|------------|
| Solo developer (Samir) | Limited development time | Automation (blog pipeline), admin efficiency |
| Budget constraints | Cannot use expensive services | Serverless pay-as-you-go, free tiers |
| Time constraints | Cannot build everything at once | Prioritized feature list, MVP approach |
| No custom domain (yet) | SEO impact | Canonical URLs, next.config.js redirects |
| In-memory rate limiting | Unreliable in serverless | TODO: Move to Upstash Redis |
| `admin_users` table unused | Schema debt | Document in CONTEXT.md, don't build on it |

### 11.2 Assumptions

| Assumption | Validation |
|------------|------------|
| Target audience primarily uses desktop | Analytics will confirm |
| Blog content will be updated regularly | Automated pipeline + manual posts |
| AI chatbot will be used by >10% of visitors | Chat logging will measure |
| Push notifications will have >10% opt-in rate | Subscription tracking |
| Contact form will generate >5 inquiries/month | Form submissions logged |
| Site will rank for "Samir Shaikh" within 3 months | Search Console monitoring |

### 11.3 Dependencies

| Dependency | Risk | Mitigation |
|------------|------|------------|
| Vercel hosting | Service outage | Vercel status page, monitoring |
| Neon database | Service outage | Automated backups, point-in-time recovery |
| Cloudinary | Service outage | Local fallbacks, CDN caching |
| GitHub API | Rate limiting | Caching (1h), error handling |
| Groq API | Service outage | Fallback responses, graceful degradation |
| Google AI API | Service outage | Error handling, chatbot degradation |

---

## 12. Future Enhancements

### 12.1 Short-Term (1-3 months)

| Enhancement | Priority | Effort |
|-------------|----------|--------|
| Custom domain setup | High | Low |
| Upstash Redis for rate limiting | High | Medium |
| Email newsletter integration | Medium | Medium |
| Project case study templates | Medium | Medium |
| Analytics dashboard (admin) | Medium | High |

### 12.2 Medium-Term (3-6 months)

| Enhancement | Priority | Effort |
|-------------|----------|--------|
| Multi-language support (i18n) | Medium | High |
| Comment moderation system | Medium | Medium |
| Project collaboration features | Low | High |
| API documentation page | Low | Medium |
| Dark mode auto-detection | Low | Low |

### 12.3 Long-Term (6-12 months)

| Enhancement | Priority | Effort |
|-------------|----------|--------|
| E-book/documentation section | Low | High |
| Video content integration | Low | High |
| Community forum | Low | Very High |
| Mobile app (React Native) | Low | Very High |
| AI-powered content recommendations | Low | High |

---

## 13. Appendix

### 13.1 Glossary

| Term | Definition |
|------|------------|
| **ISR** | Incremental Static Regeneration — Next.js feature for updating static pages |
| **RAG** | Retrieval-Augmented Generation — AI technique combining search with generation |
| **PWA** | Progressive Web App — Web app with native app capabilities |
| **FDE** | Forward Deployed Engineer — Role combining technical and customer-facing work |
| **pgvector** | PostgreSQL extension for vector similarity search |
| **JSONB** | Binary JSON data type in PostgreSQL for flexible schema |
| **ISR** | Incremental Static Regeneration — Next.js feature for updating static pages |
| **AEO** | Answer Engine Optimization — Structuring content for AI answer extraction |
| **GEO** | Generative Engine Optimization — Structuring content for AI citation |

### 13.2 Related Documents

| Document | Purpose |
|----------|---------|
| `CONTEXT.md` | Technical context for AI assistants |
| `docs/design.md` | Design system and component patterns |
| `docs/seo/nextjs-portfolio-seo-report.md` | SEO best practices research |
| `docs/seo/Seo-aeo-geo-fde-strategy.md` | AEO/GEO/FDE keyword strategy |
| `docs/tech/drizzle-command.md` | Drizzle ORM command reference |
| `.env.example` | Environment variable documentation |

### 13.3 Revision History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | July 17, 2026 | Initial PRD creation |
| 1.1 | July 17, 2026 | Enhanced Target Audience (§3) and Core Objectives (§4) with SEO / AEO / GEO / EEAT and AI-search optimization; added keyword strategy, entity associations, technical SEO, and AI-search success metrics |

---

**Document End**

> This PRD serves as the single source of truth for Samir's Portfolio project. All feature development, design decisions, and technical implementations should align with the requirements and objectives outlined in this document.

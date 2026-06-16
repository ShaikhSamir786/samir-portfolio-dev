# Samir's Portfolio

**Live at:** [shreyashswami.is-a.dev](https://shreyashswami.is-a.dev)

An elegant, high-performance personal portfolio and blog built with modern web technologies. This project showcases my work, skills, and articles, integrated with an AI-powered assistant.

## Features

- **Core Framework**: Built with [Next.js 16](https://nextjs.org/) and [Tailwind CSS v4](https://tailwindcss.com/) for a highly performant, globally distributed, and responsive UI.
- **AI Integration**: A smart chatbot powered by the [Vercel AI SDK](https://sdk.vercel.ai/docs) using Google/Groq models to answer contextual queries about my experience.
- **Data Persistence & Media**: Utilizes [Neon Postgres](https://neon.tech/) and [Drizzle ORM](https://orm.drizzle.team/) for a fast, serverless database, alongside [Cloudinary](https://cloudinary.com/) for optimized image and media storage.
- **Authentication**: Secure user sessions are handled by [NextAuth.js v5](https://next-auth.js.org/) to protect admin routes and management interfaces.
- **Email & Communications**: Uses [Nodemailer](https://nodemailer.com/) to seamlessly handle incoming messages from the contact form.
- **Analytics**: Tracks visitors using Google Analytics and fetches live GitHub stats (ensure your GitHub PAT has `read:org`, `read:user`, and `repo` permissions to use this).
- **Rich Text Editing**: Uses the [Tiptap](https://tiptap.dev/) headless editor to provide a seamless, notion-like content creation experience for the blog.
- **PWA Capabilities**: Integrated with [Serwist](https://serwist.build/) to support offline caching, app installability, and custom web push notifications.
- **Custom Subdomain**: Uses a free `.is-a.dev` domain, which anyone can obtain by submitting a pull request to the [is-a-dev/register](https://github.com/is-a-dev/register) repository.
- **Security & Rate Limiting**: Employs [Upstash Redis](https://upstash.com/) to enforce strict API rate limits and [IPinfo](https://ipinfo.io/) to identify and block malicious traffic or VPNs. (Optional - can be turned off by env variables)

## Getting Started

First, install the dependencies:

```bash
pnpm install
```

Then, set up your environment variables by copying the example file:

```bash
cp .env.example .env
```

Finally, run the development server:

```bash
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

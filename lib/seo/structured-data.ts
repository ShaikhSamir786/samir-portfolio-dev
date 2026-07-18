import {
  APP_URL,
  AUTHOR_NAME,
  AUTHOR_EMAIL,
  AUTHOR_PHONE,
  SITE_NAME,
} from "@/lib/site-config";

const SAME_AS = [
  "https://linkedin.com/in/samir-shaikh-760b932a8",
  "https://github.com/ShaikhSamir786",
];

/**
 * Long-tail, intent-rich search phrases the brand should be associated with.
 * Surfaced as `keywords` on the WebSite/Organization nodes to strengthen GEO
 * (Generative Engine Optimization) entity relationships.
 */
export const LONGTAIL_KEYWORDS = [
  "hire Node.js backend developer",
  "hire AI Node.js backend developer",
  "freelance backend engineer for startups",
  "freelance AI backend engineer for startups",
  "build a RAG chatbot for my website",
  "integrate an LLM into my SaaS product",
  "AI agent development services",
  "custom REST and GraphQL API development",
  "event-driven microservices architecture consultant",
  "scalable Node.js backend development",
  "AI backend engineer open to remote work",
  "Forward Deployed Engineer for AI products",
  "vector search and semantic search implementation",
  "production-grade AI chatbot development",
  "hire a backend developer for my startup",
  "Node.js developer for hire remote",
  "AI Node.js developer for hire remote",
  "build a semantic search engine with pgvector",
  "NestJS API development for SaaS",
  "reduce LLM hallucinations with RAG",
  "design a scalable microservices backend",
  "Kafka and BullMQ event pipeline developer",
  "add AI chat to my existing product",
  "backend developer experienced with Docker and CI/CD",
  "TypeScript backend engineer for AI startups",
  "migrate a monolith to microservices",
  "optimize slow PostgreSQL queries and APIs",
];

/**
 * Voice-search / conversational questions (AEO), framed around the problems
 * prospective clients and recruiters actually ask out loud.
 */
export const VOICE_QUERIES = [
  "who can build an AI chatbot for my business",
  "how do I add semantic search to my application",
  "which developer can integrate an LLM into my product",
  "who builds scalable Node.js backends for startups",
  "how do I hire a backend engineer for an AI project",
  "who can build a RAG system that stops my chatbot from hallucinating",
  "which engineer can turn my monolith into microservices",
  "who can help me ship an AI feature into my SaaS product",
  "how do I find a remote TypeScript backend developer",
  "who builds event-driven systems with Kafka and Redis",
];

/** Industries this personal brand serves. */
export const INDUSTRIES_SERVED = [
  "SaaS",
  "Startups",
  "E-commerce",
  "Fintech",
  "EdTech",
  "Healthcare Technology",
  "Developer Tools",
  "AI Products",
];

/** Geographic markets served (aligned with the PRD hiring markets). */
export const AREA_SERVED = [
  "United States",
  "Canada",
  "United Kingdom",
  "Germany",
  "Netherlands",
  "Australia",
  "Singapore",
  "India",
  "Worldwide (Remote)",
];

/** Concrete, problem-oriented services offered. */
export const SERVICES = [
  {
    name: "Backend API Development",
    description:
      "Design and build production REST and GraphQL APIs with Node.js, Express, and NestJS — solving slow, unscalable, or unmaintainable backend problems.",
  },
  {
    name: "RAG System Development",
    description:
      "Build Retrieval-Augmented Generation pipelines with pgvector semantic search so LLM answers stay grounded in your data and stop hallucinating.",
  },
  {
    name: "LLM Integration",
    description:
      "Integrate LLMs (Google Gemini, OpenAI) into products for chat, automation, and content generation via the Vercel AI SDK.",
  },
  {
    name: "AI Agent Development",
    description:
      "Design tool-using, multi-step autonomous AI agents that reason and orchestrate tasks across multiple LLM calls.",
  },
  {
    name: "Microservices Architecture",
    description:
      "Architect event-driven, scalable microservices using Apache Kafka, BullMQ, and Redis for high-throughput workloads.",
  },
  {
    name: "DevOps & Observability",
    description:
      "Containerize with Docker, ship CI/CD with GitHub Actions, and add OpenTelemetry, Prometheus, and Grafana observability.",
  },
] as const;

/** Reusable Offer nodes built from SERVICES (shared by Person + Organization). */
const SERVICE_OFFERS = SERVICES.map((service) => ({
  "@type": "Offer",
  itemOffered: {
    "@type": "Service",
    name: service.name,
    serviceType: service.name,
    description: service.description,
  },
}));

export function getRootJsonLd() {
  return [
    {
      "@context": "https://schema.org",
      "@type": "Person",
      name: AUTHOR_NAME,
      url: APP_URL,
      image: `${APP_URL}/Filled_Logo.png`,
      email: AUTHOR_EMAIL,
      telephone: AUTHOR_PHONE,
      jobTitle: "AI Backend Engineer | AI SDE | Agentic AI Engineer",
      description:
        "AI Backend Engineer and AI SDE with production experience architecting scalable, event-driven backend solutions, Retrieval-Augmented Generation (RAG) systems, and agentic AI workflows. Strong interest in customer-embedded, forward-deployed engineering work.",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Vapi / Surat",
        addressRegion: "Gujarat",
        addressCountry: "IN",
      },
      sameAs: SAME_AS,
      alumniOf: {
        "@type": "CollegeOrUniversity",
        name: "Uka Tarsadia University",
        sameAs: "https://utu.ac.in",
        educationalCredentialAwarded: "Bachelor of Technology in Information Technology",
      },
      hasOccupation: [
        {
          "@type": "Occupation",
          name: "AI Backend Engineer",
          occupationLocation: {
            "@type": "Country",
            name: "IN",
          },
          skills: "Node.js, TypeScript, PostgreSQL, RAG Systems, LLM Integration, Microservices, Docker, Kafka",
          validFrom: "2024",
        },
      ],
      knowsAbout: [
        "AI Backend Engineering",
        "AI Software Development Engineering",
        "Agentic AI",
        "AI Agents",
        "Multi-Agent Systems",
        "AI Orchestration",
        "Autonomous AI Workflows",
        "Tool-Using AI",
        "Retrieval Augmented Generation (RAG)",
        "LLM Integration",
        "Forward Deployed Engineering",
        "Customer-Embedded Problem Solving",
        "End-to-End Ownership",
        "Vector Search",
        "pgvector",
        "Semantic Search",
        "Embeddings",
        "Vercel AI SDK",
        "Google Gemini API",
        "Prompt Engineering",
        "AI Chatbot Development",
        "Node.js",
        "Express.js",
        "NestJS",
        "GraphQL",
        "REST APIs",
        "PostgreSQL",
        "MySQL",
        "MongoDB",
        "Redis",
        "Firebase",
        "BullMQ",
        "Apache Kafka",
        "Docker",
        "TypeScript",
        "JavaScript",
        "JWT",
        "Socket.io",
        "Sequelize",
        "OpenTelemetry",
        "Prometheus",
        "Grafana",
        "GitHub Actions",
        "CI/CD",
        "Microservices",
        "Next.js",
        "React",
      ],
      worksFor: {
        "@type": "Organization",
        name: "Logicwind",
      },
      knowsLanguage: "English",
      makesOffer: SERVICE_OFFERS,
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: SITE_NAME,
      url: APP_URL,
      description:
        "Portfolio of Samir Shaikh, AI Backend Engineer and AI SDE specializing in RAG pipelines, LLM-powered chatbots, agentic AI systems, and event-driven microservices.",
      author: {
        "@type": "Person",
        name: AUTHOR_NAME,
      },
      inLanguage: "en-US",
      keywords: LONGTAIL_KEYWORDS.join(", "),
      speakable: {
        "@type": "SpeakableSpecification",
        cssSelector: ["h1", "h2"],
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: SITE_NAME,
      alternateName: AUTHOR_NAME,
      url: APP_URL,
      logo: `${APP_URL}/Filled_Logo.png`,
      image: `${APP_URL}/Filled_Logo.png`,
      email: AUTHOR_EMAIL,
      telephone: AUTHOR_PHONE,
      description:
        "Personal brand of Samir Shaikh — AI Backend Engineer and AI SDE offering backend engineering, RAG systems, LLM integration, and agentic AI development services.",
      founder: {
        "@type": "Person",
        name: AUTHOR_NAME,
        url: APP_URL,
      },
      address: {
        "@type": "PostalAddress",
        addressLocality: "Vapi / Surat",
        addressRegion: "Gujarat",
        addressCountry: "IN",
      },
      slogan: "Backend depth meets AI product ownership.",
      knowsAbout: INDUSTRIES_SERVED,
      areaServed: AREA_SERVED,
      keywords: LONGTAIL_KEYWORDS.join(", "),
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Backend & AI Engineering Services",
        itemListElement: SERVICE_OFFERS,
      },
      sameAs: SAME_AS,
    },
  ];
}

/**
 * Builds a CollectionPage + ItemList JSON-LD object for index/listing pages
 * (e.g. the blog and projects listings).
 */
export function getCollectionPageJsonLd(opts: {
  name: string;
  description: string;
  path: string;
  items: { name: string; path: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: opts.name,
    description: opts.description,
    url: `${APP_URL}${opts.path}`,
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: APP_URL,
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: opts.items.length,
      itemListElement: opts.items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        url: `${APP_URL}${item.path}`,
      })),
    },
  };
}

/**
 * Standalone ProfessionalService JSON-LD describing the services, industries,
 * and markets served. Wire onto the contact/home pages to reinforce the
 * service + industry entity graph for AI answer engines.
 */
export function getServiceJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: `${AUTHOR_NAME} — Backend & AI Engineering`,
    url: APP_URL,
    image: `${APP_URL}/Filled_Logo.png`,
    description:
      "Backend and AI engineering services: production APIs, RAG systems, LLM integration, AI agents, microservices, and DevOps for startups and SaaS products.",
    provider: {
      "@type": "Person",
      name: AUTHOR_NAME,
      url: APP_URL,
    },
    areaServed: AREA_SERVED,
    knowsAbout: INDUSTRIES_SERVED,
    keywords: LONGTAIL_KEYWORDS.join(", "),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Backend & AI Engineering Services",
      itemListElement: SERVICE_OFFERS,
    },
  };
}

/**
 * SpeakableSpecification JSON-LD for voice-search / voice-assistant surfaces.
 * Attach on content pages, targeting the headline and lead copy.
 */
export function getSpeakableJsonLd(
  cssSelector: string[] = ["h1", "h2", ".prose p"],
) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector,
    },
  };
}

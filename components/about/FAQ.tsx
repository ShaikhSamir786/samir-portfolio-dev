export default function FAQ() {
  const faqs = [
    {
      question: "What is your primary tech stack?",
      answer:
        "My primary stack is Node.js, Express.js, NestJS, and PostgreSQL for backend development, plus the Vercel AI SDK, Google Gemini embeddings, and pgvector for RAG systems. I also use Redis for caching, BullMQ for background jobs, and Apache Kafka for event-driven architectures.",
    },
    {
      question: "Do you have experience building AI-powered applications?",
      answer:
        "Yes, I have hands-on experience building AI-powered applications, including this portfolio chatbot. It is a production RAG system I built from scratch that embeds site content with Google Gemini via the Vercel AI SDK, retrieves context using pgvector cosine similarity search, and grounds every answer in exact URLs and titles to reduce hallucinations.",
    },
    {
      question: "Are you open to remote work or freelance projects?",
      answer:
        "Yes, I am open to remote AI Backend Engineer and Node.js Backend Developer roles, as well as freelance backend engineering projects globally.",
    },
    {
      question: "Are you interested in Forward Deployed Engineer roles?",
      answer:
        "Yes, I am actively exploring Forward Deployed Engineer roles that combine deep backend and AI engineering with direct customer ownership. I am most motivated by roles where I can translate ambiguous customer problems into production systems with clear impact.",
    },
    {
      question: "Why are customer-facing engineering roles a good fit for you?",
      answer:
        "Customer-facing engineering is a strong fit for me because I enjoy taking ownership from problem discovery through deployment. My work on production backend systems, RAG pipelines, and AI-powered workflows has required balancing technical depth with practical user and business outcomes.",
    },
    {
      question: "How does your current work map to Forward Deployed Engineering?",
      answer:
        "My current work maps well to Forward Deployed Engineering because it already blends ambiguity handling, full-stack delivery, and measurable outcomes. I routinely design APIs, data flows, and AI features end-to-end, then refine them based on real usage and constraints.",
    },
    {
      question: "What kind of projects have you worked on?",
      answer:
        "I have built a production RAG chatbot with vector search, architected scalable microservices, built secure REST and GraphQL APIs, and developed platforms such as a WhatsApp campaign system and an AI-driven customer ticket triage system.",
    },
    {
      question: "What is your experience with DevOps and deployment?",
      answer:
        "I regularly use Docker and Docker Compose for containerization, GitHub Actions for CI/CD pipelines, and implement observability using OpenTelemetry, Prometheus, and Grafana.",
    },
    {
      question: "Where are you based?",
      answer:
        "I am based in Vapi / Surat, Gujarat, India, but I am comfortable working in remote environments across different time zones.",
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <div className="mt-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h2 className="text-2xl font-bold tracking-tight text-foreground mb-6">
        Frequently Asked Questions
      </h2>
      <dl className="space-y-6">
        {faqs.map((faq, index) => (
          <div key={index} className="space-y-2">
            <dt className="text-lg font-medium text-foreground">
              {faq.question}
            </dt>
            <dd className="text-text-muted leading-relaxed">
              {faq.answer}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

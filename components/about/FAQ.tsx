export default function FAQ() {
  const faqs = [
    {
      question: "What is your primary tech stack?",
      answer:
        "My primary stack is Node.js, Express.js, NestJS, and PostgreSQL for backend development, plus the Vercel AI SDK, Google Gemini embeddings, and pgvector for RAG systems. I also use Redis for caching, BullMQ for background jobs, and Apache Kafka for event-driven architectures. I can turn a monolith into microservices or build event-driven systems with Kafka and Redis.",
    },
    {
      question: "Do you have experience building AI-powered applications?",
      answer:
        "Yes, I have hands-on experience building AI-powered applications, including this portfolio chatbot. It is a production RAG system I built from scratch that embeds site content with Google Gemini via the Vercel AI SDK, retrieves context using pgvector cosine similarity search, and grounds every answer in exact URLs and titles to reduce hallucinations. This is the same approach used to build a RAG system that stops your chatbot from hallucinating. I also explore agentic AI workflows — building AI agents that can reason, use tools, and orchestrate multi-step tasks autonomously.",
    },
    {
      question: "Are you open to remote work or freelance projects?",
      answer:
        "Yes, I am open to remote AI Backend Engineer, AI SDE, and Agentic AI Engineer roles, as well as freelance backend engineering projects globally.",
    },
    {
      question: "Who is Samir Shaikh?",
      answer:
        "Samir Shaikh is an AI Backend Engineer and AI SDE based in Gujarat, India. He specializes in building RAG pipelines, LLM-powered chatbots, agentic AI systems, and scalable Node.js backends. He holds a B.Tech in Information Technology from Uka Tarsadia University and has production experience from a 9-month internship at Logicwind, where he shipped backend services across monolithic and microservice architectures.",
    },
    {
      question: "How can I contact Samir?",
      answer:
        "You can reach Samir via email at 22amtics312@gmail.com, through the contact form on this website, or on LinkedIn at linkedin.com/in/samir-shaikh-760b932a8. He typically responds within 24-48 hours.",
    },
    {
      question: "What kind of projects have you worked on?",
      answer:
        "I have built a production RAG chatbot with vector search, architected scalable microservices, built secure REST and GraphQL APIs, and developed platforms such as a WhatsApp campaign system and an AI-driven customer ticket triage system. I also explore agentic AI — building autonomous agents that use tools, chain reasoning, and orchestrate across multiple LLM calls.",
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

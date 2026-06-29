import Script from "next/script";

export default function FAQ() {
  const faqs = [
    {
      question: "What is your primary tech stack?",
      answer:
        "My primary backend tech stack includes Node.js, Express.js, NestJS, and PostgreSQL. I also have strong experience with Redis for caching, BullMQ for background jobs, and Apache Kafka for event-driven architectures.",
    },
    {
      question: "Are you open to remote work or freelance projects?",
      answer:
        "Yes, I am actively open to remote Node.js Backend Developer roles and freelance backend engineering projects globally.",
    },
    {
      question: "What kind of projects have you worked on?",
      answer:
        "I have architected scalable microservices, built secure REST and GraphQL APIs, and developed platforms like a WhatsApp promotional campaign system and an AI-driven customer ticket triage system.",
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
      <Script
        id="faq-json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        strategy="beforeInteractive"
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

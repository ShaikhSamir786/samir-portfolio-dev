// Rotating pillar topics grounded in Samir's real stack + positioning.
// The model picks/narrows one per run and is told to skip anything close
// to an already-published title, so this stays fresh across runs without
// needing a separate research API.
export const TOPIC_PILLARS = [
  // Tier 1 — directly targets AI Backend Engineer positioning
  "Building and scaling a Retrieval-Augmented Generation (RAG) pipeline with pgvector",
  "Practical prompt engineering and evaluation for production LLM features",
  "Designing a microservice pipeline for AI customer ticket triage",
  "What actually breaks when you deploy an AI feature into a real customer environment",

  // Tier 2 — Forward Deployed Engineer positioning
  "What moving toward Forward Deployed Engineering looks like for a backend-first engineer",
  "Lessons from building a production WhatsApp automation system (whatsapp-web.js)",

  // Tier 3 — general backend depth / infra credibility
  "Event-driven backend architecture with Kafka and BullMQ",
  "Observability for Node.js/NestJS services with OpenTelemetry, Prometheus, and Grafana",
  "GraphQL vs REST tradeoffs from a real full-stack project (Eventify)",

  // Consider merging or sharpening — overlaps with pillar 1 (see note above)
  "Semantic search and embeddings in practice: pgvector cosine similarity end-to-end",
];
"use client";

import dynamic from "next/dynamic";

const CloudTransition = dynamic(
  () => import("@/components/layout/CloudTransition"),
  { ssr: false }
);

const PushSettings = dynamic(
  () => import("@/components/PushSettings").then((m) => ({ default: m.PushSettings })),
  { ssr: false }
);

const Chatbot = dynamic(
  () => import("@/components/Chatbot"),
  { ssr: false }
);

/**
 * LazyClientComponents — a single Client Component boundary that
 * lazy-loads all heavy, client-only widgets with ssr:false.
 * This approach is required because `next/dynamic` with `ssr: false`
 * cannot be used directly in Server Components.
 */
export default function LazyClientComponents() {
  return (
    <>
      <CloudTransition />
      <PushSettings />
      <Chatbot />
    </>
  );
}

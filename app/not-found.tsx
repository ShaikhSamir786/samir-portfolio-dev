import type { Metadata } from "next";
import NotFoundAnimation from "@/components/not-found/NotFoundAnimation";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you are looking for does not exist.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <main className="flex flex-1 items-center justify-center px-6">
      <NotFoundAnimation />
    </main>
  );
}

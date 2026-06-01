import Hero from "@/components/home/Hero";
import { PushSettings } from "@/components/PushSettings";

export default function Home() {
  return (
    <main className="flex flex-col flex-1">
      <Hero />
      <PushSettings />
    </main>
  );
}

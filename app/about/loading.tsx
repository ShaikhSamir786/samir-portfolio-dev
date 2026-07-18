import { AboutSkeleton } from "@/components/ui/Skeleton";

export default function AboutLoading() {
  return (
    <main className="flex flex-col flex-1 px-6 pb-20 md:px-10">
      <AboutSkeleton />
    </main>
  );
}

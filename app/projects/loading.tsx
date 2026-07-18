import { ProjectCardSkeleton } from "@/components/ui/Skeleton";

export default function ProjectsLoading() {
  return (
    <main className="flex flex-col flex-1 px-6 pb-20 pt-6 md:pt-10 md:px-10">
      <div className="max-w-6xl mx-auto w-full">
        <div className="mb-10 space-y-3">
          <div className="h-8 w-56 animate-pulse rounded-lg bg-hover-bg" />
          <div className="h-4 w-80 animate-pulse rounded-lg bg-hover-bg" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <ProjectCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </main>
  );
}

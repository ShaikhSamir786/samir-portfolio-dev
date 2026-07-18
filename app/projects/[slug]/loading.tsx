import { ProjectDetailSkeleton } from "@/components/ui/Skeleton";

export default function ProjectDetailLoading() {
  return (
    <main className="flex-1">
      <ProjectDetailSkeleton />
    </main>
  );
}

import { BlogDetailSkeleton } from "@/components/ui/Skeleton";

export default function BlogPostLoading() {
  return (
    <main className="flex flex-col flex-1 px-6 pb-20 pt-4 md:px-10">
      <BlogDetailSkeleton />
    </main>
  );
}

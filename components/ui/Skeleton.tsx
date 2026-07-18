import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-lg bg-hover-bg", className)}
      {...props}
    />
  );
}

export function BlogCardSkeleton() {
  return (
    <div className="flex flex-col bg-background border border-border-primary rounded-xl overflow-hidden">
      <Skeleton className="w-full aspect-[16/10] rounded-none" />
      <div className="p-5 space-y-3">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    </div>
  );
}

export function ProjectCardSkeleton() {
  return (
    <div className="flex flex-col bg-background border border-border-primary rounded-xl overflow-hidden">
      <Skeleton className="w-full aspect-[16/10] rounded-none" />
      <div className="p-5 space-y-3">
        <div className="flex gap-1.5">
          <Skeleton className="h-4 w-14 rounded-sm" />
          <Skeleton className="h-4 w-12 rounded-sm" />
          <Skeleton className="h-4 w-16 rounded-sm" />
        </div>
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3 w-full" />
      </div>
    </div>
  );
}

export function BlogDetailSkeleton() {
  return (
    <div className="max-w-3xl mx-auto w-full space-y-8">
      <Skeleton className="h-3 w-32" />
      <Skeleton className="h-3 w-20" />
      <div className="space-y-3">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-3/4" />
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="w-full aspect-[16/7] rounded-2xl" />
      <div className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    </div>
  );
}

export function ProjectDetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-6 md:px-10 py-10 md:py-16 space-y-8">
      <Skeleton className="h-3 w-32" />
      <Skeleton className="h-3 w-24" />
      <div className="space-y-3">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-2/3" />
      </div>
      <Skeleton className="h-5 w-3/4" />
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16 rounded-md" />
        <Skeleton className="h-6 w-14 rounded-md" />
        <Skeleton className="h-6 w-20 rounded-md" />
      </div>
      <Skeleton className="w-full aspect-[21/9] rounded-2xl" />
      <div className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
}

export function AboutSkeleton() {
  return (
    <div className="max-w-3xl mx-auto w-full space-y-8">
      <Skeleton className="h-3 w-32" />
      <Skeleton className="h-8 w-24" />
      <div className="space-y-6 pl-10">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-5/6" />
          </div>
        ))}
      </div>
    </div>
  );
}

export { Skeleton };

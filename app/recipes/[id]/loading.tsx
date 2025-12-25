import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

function PageHeaderSkeleton() {
  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-14" />
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>
    </header>
  );
}

export default function RecipeLoading() {
  return (
    <div className="min-h-screen bg-background">
      <PageHeaderSkeleton />

      <main className="mx-auto max-w-4xl px-4 py-8">
        <Skeleton className="h-8 w-2/3" />

        <div className="mt-6 space-y-6">
          <div className="flex flex-wrap gap-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
          </div>

          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-14 rounded-full" />
            <Skeleton className="h-5 w-12 rounded-full" />
          </div>

          <Separator />

          <div>
            <Skeleton className="mb-4 h-6 w-24" />
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-start gap-2">
                  <Skeleton className="h-2 w-2" />
                  <Skeleton className="h-4 w-full max-w-xs" />
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <Skeleton className="mb-4 h-6 w-24" />
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

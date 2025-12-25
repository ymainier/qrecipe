import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

function PageHeaderSkeleton({ showActions = false }: { showActions?: boolean }) {
  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="flex items-center gap-2">
          {showActions ? <Skeleton className="h-9 w-32" /> : null}
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>
    </header>
  );
}

function RecipeCardSkeleton() {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <Skeleton className="h-6 w-3/4" />
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="mt-3 flex flex-wrap gap-1">
          <Skeleton className="h-5 w-14 rounded-full" />
          <Skeleton className="h-5 w-12 rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function RecipesLoading() {
  return (
    <div className="min-h-screen bg-background">
      <PageHeaderSkeleton showActions />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <RecipeCardSkeleton key={i} />
          ))}
        </div>
      </main>
    </div>
  );
}

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-10" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>
    </header>
  );
}

export default function EditRecipeLoading() {
  return (
    <div className="min-h-screen bg-background">
      <PageHeaderSkeleton />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Edit Recipe</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              <div className="space-y-2">
                <Label>Title *</Label>
                <Input disabled />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Servings</Label>
                  <Input type="number" disabled />
                </div>
                <div className="space-y-2">
                  <Label>Prep Time (min)</Label>
                  <Input type="number" disabled />
                </div>
                <div className="space-y-2">
                  <Label>Cook Time (min)</Label>
                  <Input type="number" disabled />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Ingredients</Label>
                  <Button type="button" variant="ghost" size="sm" disabled>
                    + Add Ingredient
                  </Button>
                </div>
                <div className="space-y-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <Input placeholder="Qty" className="w-20" disabled />
                      <Input placeholder="Unit" className="w-20" disabled />
                      <Input placeholder="Ingredient name" className="flex-1" disabled />
                      <Button type="button" variant="ghost" size="sm" disabled className="text-destructive">
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Steps</Label>
                  <Button type="button" variant="ghost" size="sm" disabled>
                    + Add Step
                  </Button>
                </div>
                <div className="space-y-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="mt-2 w-6 text-muted-foreground">{i + 1}.</span>
                      <Textarea placeholder="Step instruction" rows={2} className="flex-1" disabled />
                      <Button type="button" variant="ghost" size="sm" disabled className="text-destructive">
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Tags (comma-separated)</Label>
                <Input placeholder="e.g., vegetarian, quick, dinner" disabled />
              </div>

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" disabled>
                  Cancel
                </Button>
                <Button type="submit" disabled>
                  Save Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

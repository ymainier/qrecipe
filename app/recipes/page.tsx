import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { PageHeader } from "@/components/page-header";
import { getUserRecipes } from "./actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function RecipesPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/signin");
  }

  const recipes = await getUserRecipes();

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Recipes" },
        ]}
        user={session.user}
        actions={
          <Button asChild>
            <Link href="/recipes/new">Add New Recipe</Link>
          </Button>
        }
      />
      <main className="mx-auto max-w-4xl px-4 py-8">

        {recipes.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                You don&apos;t have any recipes yet. Create your first one!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {recipes.map((recipe) => (
              <Link key={recipe.id} href={`/recipes/${recipe.id}`}>
                <Card className="h-full transition-shadow hover:shadow-md">
                  <CardHeader className="pb-2">
                    <CardTitle className="line-clamp-1 leading-tight">{recipe.title}</CardTitle>
                    {recipe.description ? (
                      <CardDescription className="line-clamp-2">
                        {recipe.description}
                      </CardDescription>
                    ) : null}
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                      {recipe.prepTime ? (
                        <span>Prep: {recipe.prepTime}min</span>
                      ) : null}
                      {recipe.cookTime ? (
                        <span>Cook: {recipe.cookTime}min</span>
                      ) : null}
                      {recipe.servings ? (
                        <span>Serves: {recipe.servings}</span>
                      ) : null}
                    </div>
                    {recipe.recipeTags.length > 0 ? (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {recipe.recipeTags.map((rt) => (
                          <Badge key={rt.tag.id} variant="secondary">
                            {rt.tag.name}
                          </Badge>
                        ))}
                      </div>
                    ) : null}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

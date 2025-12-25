import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { auth } from "@/lib/auth";
import { PageHeader } from "@/components/page-header";
import { getRecipe } from "../actions";
import { DeleteRecipeButton } from "./delete-button";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function RecipePage({ params }: Props) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/signin");
  }

  const { id } = await params;
  const recipe = await getRecipe(id);

  if (!recipe) {
    notFound();
  }

  const totalTime =
    (recipe.prepTime ?? 0) + (recipe.cookTime ?? 0) || null;

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Recipes", href: "/recipes" },
          { label: recipe.title },
        ]}
        user={session.user}
        actions={
          <>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/recipes/${id}/edit`}>Edit</Link>
            </Button>
            <DeleteRecipeButton recipeId={id} />
          </>
        }
      />

      <main className="mx-auto max-w-4xl px-4 py-8">
        {recipe.imageUrl ? (
          <Image
            src={recipe.imageUrl}
            alt={recipe.title}
            width={896}
            height={256}
            className="mb-6 h-64 w-full rounded-xl object-cover"
            unoptimized
          />
        ) : null}

        <h1 className="text-2xl font-bold">{recipe.title}</h1>
        {recipe.description ? (
          <p className="mt-2 text-muted-foreground">{recipe.description}</p>
        ) : null}

        <div className="mt-6 space-y-6">
          <div className="flex flex-wrap gap-4 text-sm">
            {recipe.servings ? (
              <div className="flex items-center gap-1">
                <span className="font-medium">Servings:</span>
                <span className="text-muted-foreground">{recipe.servings}</span>
              </div>
            ) : null}
            {recipe.prepTime ? (
              <div className="flex items-center gap-1">
                <span className="font-medium">Prep:</span>
                <span className="text-muted-foreground">{recipe.prepTime} min</span>
              </div>
            ) : null}
            {recipe.cookTime ? (
              <div className="flex items-center gap-1">
                <span className="font-medium">Cook:</span>
                <span className="text-muted-foreground">{recipe.cookTime} min</span>
              </div>
            ) : null}
            {totalTime ? (
              <div className="flex items-center gap-1">
                <span className="font-medium">Total:</span>
                <span className="text-muted-foreground">{totalTime} min</span>
              </div>
            ) : null}
          </div>

          {recipe.recipeTags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {recipe.recipeTags.map((rt) => (
                <Badge key={rt.tag.id} variant="secondary">
                  {rt.tag.name}
                </Badge>
              ))}
            </div>
          ) : null}

          {recipe.ingredients.length > 0 ? (
            <>
              <Separator />
              <div>
                <h2 className="mb-4 text-lg font-semibold">Ingredients</h2>
                <ul className="space-y-2">
                  {recipe.ingredients.map((ing) => (
                    <li key={ing.id} className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>
                        {ing.quantity ? `${ing.quantity} ` : ""}
                        {ing.unit ? `${ing.unit} ` : ""}
                        {ing.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : null}

          {recipe.steps.length > 0 ? (
            <>
              <Separator />
              <div>
                <h2 className="mb-4 text-lg font-semibold">Instructions</h2>
                <ol className="space-y-4">
                  {recipe.steps.map((step, index) => (
                    <li key={step.id} className="flex gap-4">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                        {index + 1}
                      </span>
                      <p className="pt-1 text-muted-foreground">
                        {step.instruction}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>
            </>
          ) : null}
        </div>
      </main>
    </div>
  );
}

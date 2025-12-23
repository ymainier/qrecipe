import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { RecipeForm } from "../../recipe-form";
import { getRecipe, updateRecipe } from "../../actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditRecipePage({ params }: Props) {
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

  const initialData = {
    title: recipe.title,
    description: recipe.description ?? "",
    servings: recipe.servings?.toString() ?? "",
    prepTime: recipe.prepTime?.toString() ?? "",
    cookTime: recipe.cookTime?.toString() ?? "",
    imageUrl: recipe.imageUrl ?? "",
    ingredients: recipe.ingredients.map((ing) => ({
      name: ing.name,
      quantity: ing.quantity ?? "",
      unit: ing.unit ?? "",
    })),
    steps: recipe.steps.map((step) => ({
      instruction: step.instruction,
    })),
    tags: recipe.recipeTags.map((rt) => rt.tag.name),
  };

  async function handleUpdate(data: Parameters<typeof updateRecipe>[1]) {
    "use server";
    await updateRecipe(id, data);
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto flex max-w-4xl items-center gap-4 px-4 py-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/recipes/${id}`}>&larr; Back</Link>
          </Button>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Edit {recipe.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <RecipeForm
              initialData={initialData}
              onSubmit={handleUpdate}
              submitLabel="Save Changes"
            />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

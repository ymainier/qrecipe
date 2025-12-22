import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { RecipeForm } from "../../recipe-form";
import { getRecipe, updateRecipe } from "../../actions";

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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link
              href={`/recipes/${id}`}
              className="text-gray-500 hover:text-gray-700"
            >
              &larr; Back
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Edit Recipe</h1>
          </div>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white shadow rounded-lg p-6">
          <RecipeForm
            initialData={initialData}
            onSubmit={handleUpdate}
            submitLabel="Save Changes"
          />
        </div>
      </main>
    </div>
  );
}

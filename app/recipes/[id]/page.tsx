import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { getRecipe } from "../actions";
import { DeleteRecipeButton } from "./delete-button";

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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/recipes"
                className="text-gray-500 hover:text-gray-700"
              >
                &larr; Back
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">
                {recipe.title}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href={`/recipes/${id}/edit`}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
              >
                Edit
              </Link>
              <DeleteRecipeButton recipeId={id} />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {recipe.imageUrl ? (
            <img
              src={recipe.imageUrl}
              alt={recipe.title}
              className="w-full h-64 object-cover"
            />
          ) : null}

          <div className="p-6">
            {recipe.description ? (
              <p className="text-gray-600 mb-6">{recipe.description}</p>
            ) : null}

            <div className="flex flex-wrap gap-6 mb-6 text-sm text-gray-500">
              {recipe.servings ? (
                <div>
                  <span className="font-medium text-gray-700">Servings:</span>{" "}
                  {recipe.servings}
                </div>
              ) : null}
              {recipe.prepTime ? (
                <div>
                  <span className="font-medium text-gray-700">Prep Time:</span>{" "}
                  {recipe.prepTime} min
                </div>
              ) : null}
              {recipe.cookTime ? (
                <div>
                  <span className="font-medium text-gray-700">Cook Time:</span>{" "}
                  {recipe.cookTime} min
                </div>
              ) : null}
              {totalTime ? (
                <div>
                  <span className="font-medium text-gray-700">Total Time:</span>{" "}
                  {totalTime} min
                </div>
              ) : null}
            </div>

            {recipe.recipeTags.length > 0 ? (
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {recipe.recipeTags.map((rt) => (
                    <span
                      key={rt.tag.id}
                      className="inline-block px-3 py-1 text-sm bg-indigo-100 text-indigo-700 rounded-full"
                    >
                      {rt.tag.name}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            {recipe.ingredients.length > 0 ? (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Ingredients
                </h2>
                <ul className="space-y-2">
                  {recipe.ingredients.map((ing) => (
                    <li key={ing.id} className="flex items-start gap-2">
                      <span className="text-indigo-600">•</span>
                      <span>
                        {ing.quantity ? `${ing.quantity} ` : ""}
                        {ing.unit ? `${ing.unit} ` : ""}
                        {ing.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {recipe.steps.length > 0 ? (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Instructions
                </h2>
                <ol className="space-y-4">
                  {recipe.steps.map((step, index) => (
                    <li key={step.id} className="flex gap-4">
                      <span className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-medium">
                        {index + 1}
                      </span>
                      <p className="text-gray-700 pt-1">{step.instruction}</p>
                    </li>
                  ))}
                </ol>
              </div>
            ) : null}
          </div>
        </div>
      </main>
    </div>
  );
}

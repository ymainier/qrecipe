import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { SignOutButton } from "./sign-out-button";
import { getUserRecipes } from "./actions";

export default async function RecipesPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/signin");
  }

  const recipes = await getUserRecipes();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Recipes</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-700">Welcome, {session.user.name}</span>
            <SignOutButton />
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            href="/recipes/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Add New Recipe
          </Link>
        </div>

        {recipes.length === 0 ? (
          <p className="text-gray-600">
            You don&apos;t have any recipes yet. Create your first one!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <Link
                key={recipe.id}
                href={`/recipes/${recipe.id}`}
                className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow"
              >
                {recipe.imageUrl ? (
                  <img
                    src={recipe.imageUrl}
                    alt={recipe.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 rounded-t-lg flex items-center justify-center">
                    <span className="text-gray-400 text-4xl">🍽️</span>
                  </div>
                )}
                <div className="p-4">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {recipe.title}
                  </h2>
                  {recipe.description ? (
                    <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                      {recipe.description}
                    </p>
                  ) : null}
                  <div className="flex items-center gap-4 text-sm text-gray-500">
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
                        <span
                          key={rt.tag.id}
                          className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
                        >
                          {rt.tag.name}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { RecipeForm } from "../recipe-form";
import { createRecipe } from "../actions";

export default async function NewRecipePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/signin");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link
              href="/recipes"
              className="text-gray-500 hover:text-gray-700"
            >
              &larr; Back
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">New Recipe</h1>
          </div>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white shadow rounded-lg p-6">
          <RecipeForm onSubmit={createRecipe} submitLabel="Create Recipe" />
        </div>
      </main>
    </div>
  );
}

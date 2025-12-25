import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { PageHeader } from "@/components/page-header";
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
    <div className="min-h-screen bg-background">
      <PageHeader
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Recipes", href: "/recipes" },
          { label: "New Recipe" },
        ]}
        user={session.user}
      />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold">Create a new recipe</h1>
        <RecipeForm onSubmit={createRecipe} submitLabel="Create Recipe" />
      </main>
    </div>
  );
}

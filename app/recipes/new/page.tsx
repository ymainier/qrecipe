import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { RecipeForm } from "../recipe-form";
import { createRecipe } from "../actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function NewRecipePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/signin");
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto flex max-w-4xl items-center gap-4 px-4 py-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/recipes">&larr; Back</Link>
          </Button>
          <h1 className="text-xl font-semibold">New Recipe</h1>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Create a new recipe</CardTitle>
          </CardHeader>
          <CardContent>
            <RecipeForm onSubmit={createRecipe} submitLabel="Create Recipe" />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

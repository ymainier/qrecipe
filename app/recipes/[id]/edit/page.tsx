import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { PageHeader } from "@/components/page-header";
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
    <div className="min-h-screen bg-background">
      <PageHeader
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Recipes", href: "/recipes" },
          { label: recipe.title, href: `/recipes/${id}` },
          { label: "Edit" },
        ]}
        user={session.user}
      />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold">Edit {recipe.title}</h1>
        <RecipeForm
          initialData={initialData}
          onSubmit={handleUpdate}
          submitLabel="Save Changes"
        />
      </main>
    </div>
  );
}

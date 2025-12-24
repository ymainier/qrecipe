"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { updateTag } from "next/cache";
import { getCachedUserRecipes, getCachedRecipe } from "@/lib/cache";
import { eq, and, isNull } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { recipes, ingredients, steps, tags, recipeTags } from "@/db/schema";

type RecipeFormData = {
  title: string;
  description?: string;
  servings?: number;
  prepTime?: number;
  cookTime?: number;
  imageUrl?: string;
  ingredients: { name: string; quantity?: string; unit?: string }[];
  steps: { instruction: string }[];
  tags: string[];
};

async function getAuthenticatedUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/signin");
  }

  return session.user;
}

export async function createRecipe(formData: RecipeFormData) {
  const user = await getAuthenticatedUser();

  const recipeId = crypto.randomUUID();

  await db.transaction(async (tx) => {
    await tx.insert(recipes).values({
      id: recipeId,
      title: formData.title,
      description: formData.description || null,
      servings: formData.servings || null,
      prepTime: formData.prepTime || null,
      cookTime: formData.cookTime || null,
      imageUrl: formData.imageUrl || null,
      authorId: user.id,
    });

    if (formData.ingredients.length > 0) {
      await tx.insert(ingredients).values(
        formData.ingredients.map((ing) => ({
          id: crypto.randomUUID(),
          name: ing.name,
          quantity: ing.quantity || null,
          unit: ing.unit || null,
          recipeId,
        }))
      );
    }

    if (formData.steps.length > 0) {
      await tx.insert(steps).values(
        formData.steps.map((step, index) => ({
          id: crypto.randomUUID(),
          order: index + 1,
          instruction: step.instruction,
          recipeId,
        }))
      );
    }

    if (formData.tags.length > 0) {
      for (const tagName of formData.tags) {
        const trimmedName = tagName.trim().toLowerCase();
        if (!trimmedName) continue;

        const existingTag = await tx
          .select()
          .from(tags)
          .where(eq(tags.name, trimmedName))
          .limit(1);

        let tagId: string;
        if (existingTag.length > 0) {
          tagId = existingTag[0].id;
        } else {
          tagId = crypto.randomUUID();
          await tx.insert(tags).values({ id: tagId, name: trimmedName });
        }

        await tx.insert(recipeTags).values({ recipeId, tagId });
      }
    }
  });

  updateTag(`user-recipes-${user.id}`);
  redirect("/recipes");
}

export async function updateRecipe(recipeId: string, formData: RecipeFormData) {
  const user = await getAuthenticatedUser();

  const existingRecipe = await db
    .select()
    .from(recipes)
    .where(
      and(
        eq(recipes.id, recipeId),
        eq(recipes.authorId, user.id),
        isNull(recipes.deletedAt)
      )
    )
    .limit(1);

  if (existingRecipe.length === 0) {
    throw new Error("Recipe not found or you don't have permission to edit it");
  }

  await db.transaction(async (tx) => {
    await tx
      .update(recipes)
      .set({
        title: formData.title,
        description: formData.description || null,
        servings: formData.servings || null,
        prepTime: formData.prepTime || null,
        cookTime: formData.cookTime || null,
        imageUrl: formData.imageUrl || null,
        updatedAt: new Date(),
      })
      .where(eq(recipes.id, recipeId));

    // Delete existing ingredients and steps, then re-insert
    await tx.delete(ingredients).where(eq(ingredients.recipeId, recipeId));
    await tx.delete(steps).where(eq(steps.recipeId, recipeId));
    await tx.delete(recipeTags).where(eq(recipeTags.recipeId, recipeId));

    if (formData.ingredients.length > 0) {
      await tx.insert(ingredients).values(
        formData.ingredients.map((ing) => ({
          id: crypto.randomUUID(),
          name: ing.name,
          quantity: ing.quantity || null,
          unit: ing.unit || null,
          recipeId,
        }))
      );
    }

    if (formData.steps.length > 0) {
      await tx.insert(steps).values(
        formData.steps.map((step, index) => ({
          id: crypto.randomUUID(),
          order: index + 1,
          instruction: step.instruction,
          recipeId,
        }))
      );
    }

    if (formData.tags.length > 0) {
      for (const tagName of formData.tags) {
        const trimmedName = tagName.trim().toLowerCase();
        if (!trimmedName) continue;

        const existingTag = await tx
          .select()
          .from(tags)
          .where(eq(tags.name, trimmedName))
          .limit(1);

        let tagId: string;
        if (existingTag.length > 0) {
          tagId = existingTag[0].id;
        } else {
          tagId = crypto.randomUUID();
          await tx.insert(tags).values({ id: tagId, name: trimmedName });
        }

        await tx.insert(recipeTags).values({ recipeId, tagId });
      }
    }
  });

  updateTag(`user-recipes-${user.id}`);
  updateTag(`recipe-${recipeId}`);
  redirect(`/recipes/${recipeId}`);
}

export async function deleteRecipe(recipeId: string) {
  const user = await getAuthenticatedUser();

  const existingRecipe = await db
    .select()
    .from(recipes)
    .where(
      and(
        eq(recipes.id, recipeId),
        eq(recipes.authorId, user.id),
        isNull(recipes.deletedAt)
      )
    )
    .limit(1);

  if (existingRecipe.length === 0) {
    throw new Error(
      "Recipe not found or you don't have permission to delete it"
    );
  }

  // Soft delete
  await db
    .update(recipes)
    .set({ deletedAt: new Date() })
    .where(eq(recipes.id, recipeId));

  updateTag(`user-recipes-${user.id}`);
  updateTag(`recipe-${recipeId}`);
  redirect("/recipes");
}

export async function getRecipe(recipeId: string) {
  const user = await getAuthenticatedUser();
  return getCachedRecipe(recipeId, user.id);
}

export async function getUserRecipes() {
  const user = await getAuthenticatedUser();
  return getCachedUserRecipes(user.id);
}

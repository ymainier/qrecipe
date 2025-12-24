import { unstable_cache } from "next/cache";
import { eq, and, isNull } from "drizzle-orm";
import { db } from "@/db";
import { recipes } from "@/db/schema";

export function getCachedUserRecipes(userId: string) {
  return unstable_cache(
    async () => {
      const userRecipes = await db.query.recipes.findMany({
        where: and(eq(recipes.authorId, userId), isNull(recipes.deletedAt)),
        orderBy: (recipes, { desc }) => [desc(recipes.createdAt)],
        with: {
          recipeTags: {
            with: {
              tag: true,
            },
          },
        },
      });
      return userRecipes;
    },
    [`user-recipes-${userId}`],
    { tags: [`user-recipes-${userId}`], revalidate: 60 }
  )();
}

export function getCachedRecipe(recipeId: string, userId: string) {
  return unstable_cache(
    async () => {
      const recipe = await db.query.recipes.findFirst({
        where: and(
          eq(recipes.id, recipeId),
          eq(recipes.authorId, userId),
          isNull(recipes.deletedAt)
        ),
        with: {
          ingredients: true,
          steps: {
            orderBy: (steps, { asc }) => [asc(steps.order)],
          },
          recipeTags: {
            with: {
              tag: true,
            },
          },
        },
      });
      return recipe;
    },
    [`recipe-${recipeId}-${userId}`],
    { tags: [`recipe-${recipeId}`, `user-recipes-${userId}`], revalidate: 60 }
  )();
}

import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  mockDb,
  resetDbMocks,
  mockRecipe,
  mockRecipeExists,
  mockRecipeNotFound,
} from "@/tests/mocks/db";
import { mockAuth, mockAuthenticated, mockUnauthenticated, resetAuthMocks } from "@/tests/mocks/auth";

// Setup mocks before imports
vi.mock("@/db", () => ({
  db: mockDb,
}));

vi.mock("@/lib/auth", () => ({
  auth: mockAuth,
}));

vi.mock("@/lib/cache", () => ({
  getCachedUserRecipes: vi.fn(),
  getCachedRecipe: vi.fn(),
}));

// Import after mocking
import {
  createRecipe,
  updateRecipe,
  deleteRecipe,
  getRecipe,
  getUserRecipes,
} from "@/app/recipes/actions";
import { getCachedUserRecipes, getCachedRecipe } from "@/lib/cache";

// Helper to expect redirect
async function expectRedirect(fn: () => Promise<unknown>, expectedUrl: string) {
  await expect(fn()).rejects.toThrow(`NEXT_REDIRECT:${expectedUrl}`);
}

describe("Recipe Server Actions", () => {
  beforeEach(() => {
    resetDbMocks();
    resetAuthMocks();
  });

  describe("createRecipe", () => {
    const validFormData = {
      title: "New Recipe",
      description: "A delicious recipe",
      servings: 4,
      prepTime: 15,
      cookTime: 30,
      imageUrl: "",
      ingredients: [{ name: "Flour", quantity: "2", unit: "cups" }],
      steps: [{ instruction: "Mix ingredients" }],
      tags: ["vegetarian"],
    };

    it("should redirect to signin when not authenticated", async () => {
      mockUnauthenticated();

      await expectRedirect(() => createRecipe(validFormData), "/signin");
    });

    it("should create recipe and redirect to recipes page", async () => {
      mockAuthenticated();

      await expectRedirect(() => createRecipe(validFormData), "/recipes");

      expect(mockDb.transaction).toHaveBeenCalled();
    });

    it("should handle recipe with no ingredients", async () => {
      mockAuthenticated();
      const dataNoIngredients = { ...validFormData, ingredients: [] };

      await expectRedirect(() => createRecipe(dataNoIngredients), "/recipes");
    });

    it("should handle recipe with no tags", async () => {
      mockAuthenticated();
      const dataNoTags = { ...validFormData, tags: [] };

      await expectRedirect(() => createRecipe(dataNoTags), "/recipes");
    });

    it("should handle recipe with no steps", async () => {
      mockAuthenticated();
      const dataNoSteps = { ...validFormData, steps: [] };

      await expectRedirect(() => createRecipe(dataNoSteps), "/recipes");
    });

    it("should handle recipe with optional fields undefined", async () => {
      mockAuthenticated();
      const minimalData = {
        title: "Minimal Recipe",
        ingredients: [],
        steps: [],
        tags: [],
      };

      await expectRedirect(() => createRecipe(minimalData), "/recipes");
    });
  });

  describe("updateRecipe", () => {
    const validFormData = {
      title: "Updated Recipe",
      description: "Updated description",
      servings: 6,
      prepTime: 20,
      cookTime: 45,
      imageUrl: "",
      ingredients: [{ name: "Sugar", quantity: "1", unit: "cup" }],
      steps: [{ instruction: "Updated step" }],
      tags: ["dessert"],
    };

    it("should redirect to signin when not authenticated", async () => {
      mockUnauthenticated();

      await expectRedirect(() => updateRecipe("recipe-123", validFormData), "/signin");
    });

    it("should throw error when recipe not found", async () => {
      mockAuthenticated();
      mockRecipeNotFound();

      await expect(updateRecipe("nonexistent", validFormData)).rejects.toThrow(
        "Recipe not found or you don't have permission to edit it"
      );
    });

    it("should update recipe and redirect to recipe page", async () => {
      mockAuthenticated();
      mockRecipeExists();

      await expectRedirect(
        () => updateRecipe("recipe-123", validFormData),
        "/recipes/recipe-123"
      );

      expect(mockDb.transaction).toHaveBeenCalled();
    });
  });

  describe("deleteRecipe", () => {
    it("should redirect to signin when not authenticated", async () => {
      mockUnauthenticated();

      await expectRedirect(() => deleteRecipe("recipe-123"), "/signin");
    });

    it("should throw error when recipe not found", async () => {
      mockAuthenticated();
      mockRecipeNotFound();

      await expect(deleteRecipe("nonexistent")).rejects.toThrow(
        "Recipe not found or you don't have permission to delete it"
      );
    });

    it("should soft delete recipe and redirect to recipes page", async () => {
      mockAuthenticated();
      mockRecipeExists();

      await expectRedirect(() => deleteRecipe("recipe-123"), "/recipes");

      expect(mockDb.update).toHaveBeenCalled();
    });
  });

  describe("getRecipe", () => {
    it("should redirect to signin when not authenticated", async () => {
      mockUnauthenticated();

      await expectRedirect(() => getRecipe("recipe-123"), "/signin");
    });

    it("should call getCachedRecipe when authenticated", async () => {
      const session = mockAuthenticated();
      const recipe = mockRecipe();
      vi.mocked(getCachedRecipe).mockResolvedValue(recipe);

      const result = await getRecipe("recipe-123");

      expect(getCachedRecipe).toHaveBeenCalledWith("recipe-123", session.user.id);
      expect(result).toEqual(recipe);
    });
  });

  describe("getUserRecipes", () => {
    it("should redirect to signin when not authenticated", async () => {
      mockUnauthenticated();

      await expectRedirect(() => getUserRecipes(), "/signin");
    });

    it("should call getCachedUserRecipes when authenticated", async () => {
      const session = mockAuthenticated();
      const recipes = [mockRecipe()];
      vi.mocked(getCachedUserRecipes).mockResolvedValue(recipes);

      const result = await getUserRecipes();

      expect(getCachedUserRecipes).toHaveBeenCalledWith(session.user.id);
      expect(result).toEqual(recipes);
    });
  });
});

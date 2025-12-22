"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Ingredient = { name: string; quantity: string; unit: string };
type Step = { instruction: string };

type RecipeFormProps = {
  initialData?: {
    title: string;
    description: string;
    servings: string;
    prepTime: string;
    cookTime: string;
    imageUrl: string;
    ingredients: Ingredient[];
    steps: Step[];
    tags: string[];
  };
  onSubmit: (data: {
    title: string;
    description?: string;
    servings?: number;
    prepTime?: number;
    cookTime?: number;
    imageUrl?: string;
    ingredients: { name: string; quantity?: string; unit?: string }[];
    steps: { instruction: string }[];
    tags: string[];
  }) => Promise<void>;
  submitLabel: string;
};

export function RecipeForm({
  initialData,
  onSubmit,
  submitLabel,
}: RecipeFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState(initialData?.title ?? "");
  const [description, setDescription] = useState(
    initialData?.description ?? ""
  );
  const [servings, setServings] = useState(initialData?.servings ?? "");
  const [prepTime, setPrepTime] = useState(initialData?.prepTime ?? "");
  const [cookTime, setCookTime] = useState(initialData?.cookTime ?? "");
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl ?? "");

  const [ingredients, setIngredients] = useState<Ingredient[]>(
    initialData?.ingredients ?? [{ name: "", quantity: "", unit: "" }]
  );

  const [steps, setSteps] = useState<Step[]>(
    initialData?.steps ?? [{ instruction: "" }]
  );

  const [tagsInput, setTagsInput] = useState(initialData?.tags.join(", ") ?? "");

  function addIngredient() {
    setIngredients([...ingredients, { name: "", quantity: "", unit: "" }]);
  }

  function removeIngredient(index: number) {
    setIngredients(ingredients.filter((_, i) => i !== index));
  }

  function updateIngredient(
    index: number,
    field: keyof Ingredient,
    value: string
  ) {
    const updated = [...ingredients];
    updated[index] = { ...updated[index], [field]: value };
    setIngredients(updated);
  }

  function addStep() {
    setSteps([...steps, { instruction: "" }]);
  }

  function removeStep(index: number) {
    setSteps(steps.filter((_, i) => i !== index));
  }

  function updateStep(index: number, value: string) {
    const updated = [...steps];
    updated[index] = { instruction: value };
    setSteps(updated);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const validIngredients = ingredients.filter((ing) => ing.name.trim());
      const validSteps = steps.filter((step) => step.instruction.trim());
      const parsedTags = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        servings: servings ? parseInt(servings, 10) : undefined,
        prepTime: prepTime ? parseInt(prepTime, 10) : undefined,
        cookTime: cookTime ? parseInt(cookTime, 10) : undefined,
        imageUrl: imageUrl.trim() || undefined,
        ingredients: validIngredients,
        steps: validSteps,
        tags: parsedTags,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error ? (
        <div className="bg-red-50 text-red-700 p-4 rounded-md">{error}</div>
      ) : null}

      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Title *
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          id="description"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label
            htmlFor="servings"
            className="block text-sm font-medium text-gray-700"
          >
            Servings
          </label>
          <input
            type="number"
            id="servings"
            min="1"
            value={servings}
            onChange={(e) => setServings(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="prepTime"
            className="block text-sm font-medium text-gray-700"
          >
            Prep Time (min)
          </label>
          <input
            type="number"
            id="prepTime"
            min="0"
            value={prepTime}
            onChange={(e) => setPrepTime(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="cookTime"
            className="block text-sm font-medium text-gray-700"
          >
            Cook Time (min)
          </label>
          <input
            type="number"
            id="cookTime"
            min="0"
            value={cookTime}
            onChange={(e) => setCookTime(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="imageUrl"
          className="block text-sm font-medium text-gray-700"
        >
          Image URL
        </label>
        <input
          type="url"
          id="imageUrl"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Ingredients
          </label>
          <button
            type="button"
            onClick={addIngredient}
            className="text-sm text-indigo-600 hover:text-indigo-500"
          >
            + Add Ingredient
          </button>
        </div>
        <div className="space-y-2">
          {ingredients.map((ing, index) => (
            <div key={index} className="flex gap-2 items-start">
              <input
                type="text"
                placeholder="Quantity"
                value={ing.quantity}
                onChange={(e) =>
                  updateIngredient(index, "quantity", e.target.value)
                }
                className="w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              <input
                type="text"
                placeholder="Unit"
                value={ing.unit}
                onChange={(e) =>
                  updateIngredient(index, "unit", e.target.value)
                }
                className="w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              <input
                type="text"
                placeholder="Ingredient name"
                value={ing.name}
                onChange={(e) =>
                  updateIngredient(index, "name", e.target.value)
                }
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              {ingredients.length > 1 ? (
                <button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  className="text-red-600 hover:text-red-500 px-2"
                >
                  x
                </button>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Steps
          </label>
          <button
            type="button"
            onClick={addStep}
            className="text-sm text-indigo-600 hover:text-indigo-500"
          >
            + Add Step
          </button>
        </div>
        <div className="space-y-2">
          {steps.map((step, index) => (
            <div key={index} className="flex gap-2 items-start">
              <span className="text-gray-500 mt-2 w-6">{index + 1}.</span>
              <textarea
                placeholder="Step instruction"
                value={step.instruction}
                onChange={(e) => updateStep(index, e.target.value)}
                rows={2}
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              {steps.length > 1 ? (
                <button
                  type="button"
                  onClick={() => removeStep(index)}
                  className="text-red-600 hover:text-red-500 px-2"
                >
                  x
                </button>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      <div>
        <label
          htmlFor="tags"
          className="block text-sm font-medium text-gray-700"
        >
          Tags (comma-separated)
        </label>
        <input
          type="text"
          id="tags"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          placeholder="e.g., vegetarian, quick, dinner"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}

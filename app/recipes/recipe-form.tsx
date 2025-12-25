"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  const [description] = useState(initialData?.description ?? "");
  const [servings, setServings] = useState(initialData?.servings ?? "");
  const [prepTime, setPrepTime] = useState(initialData?.prepTime ?? "");
  const [cookTime, setCookTime] = useState(initialData?.cookTime ?? "");
  const [imageUrl] = useState(initialData?.imageUrl ?? "");

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
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="servings">Servings</Label>
          <Input
            type="number"
            id="servings"
            min="1"
            value={servings}
            onChange={(e) => setServings(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="prepTime">Prep Time (min)</Label>
          <Input
            type="number"
            id="prepTime"
            min="0"
            value={prepTime}
            onChange={(e) => setPrepTime(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cookTime">Cook Time (min)</Label>
          <Input
            type="number"
            id="cookTime"
            min="0"
            value={cookTime}
            onChange={(e) => setCookTime(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Ingredients</Label>
          <Button type="button" variant="ghost" size="sm" onClick={addIngredient}>
            + Add Ingredient
          </Button>
        </div>
        <div className="space-y-2">
          {ingredients.map((ing, index) => (
            <div key={index} className="flex items-start gap-2">
              <Input
                type="text"
                placeholder="Qty"
                value={ing.quantity}
                onChange={(e) =>
                  updateIngredient(index, "quantity", e.target.value)
                }
                className="w-20"
              />
              <Input
                type="text"
                placeholder="Unit"
                value={ing.unit}
                onChange={(e) =>
                  updateIngredient(index, "unit", e.target.value)
                }
                className="w-20"
              />
              <Input
                type="text"
                placeholder="Ingredient name"
                value={ing.name}
                onChange={(e) =>
                  updateIngredient(index, "name", e.target.value)
                }
                className="flex-1"
              />
              {ingredients.length > 1 ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeIngredient(index)}
                  className="text-destructive hover:text-destructive"
                >
                  ×
                </Button>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Steps</Label>
          <Button type="button" variant="ghost" size="sm" onClick={addStep}>
            + Add Step
          </Button>
        </div>
        <div className="space-y-2">
          {steps.map((step, index) => (
            <div key={index} className="flex items-start gap-2">
              <span className="mt-2 w-6 text-muted-foreground">{index + 1}.</span>
              <Textarea
                placeholder="Step instruction"
                value={step.instruction}
                onChange={(e) => updateStep(index, e.target.value)}
                rows={2}
                className="flex-1"
              />
              {steps.length > 1 ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeStep(index)}
                  className="text-destructive hover:text-destructive"
                >
                  ×
                </Button>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Tags (comma-separated)</Label>
        <Input
          type="text"
          id="tags"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          placeholder="e.g., vegetarian, quick, dinner"
        />
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}

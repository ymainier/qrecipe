"use client";

import { useState } from "react";
import { deleteRecipe } from "../actions";

type DeleteRecipeButtonProps = {
  recipeId: string;
};

export function DeleteRecipeButton({ recipeId }: DeleteRecipeButtonProps) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    try {
      await deleteRecipe(recipeId);
    } catch {
      setIsDeleting(false);
      setIsConfirming(false);
    }
  }

  if (isConfirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Delete?</span>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="px-3 py-1 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50"
        >
          {isDeleting ? "..." : "Yes"}
        </button>
        <button
          onClick={() => setIsConfirming(false)}
          disabled={isDeleting}
          className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
        >
          No
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setIsConfirming(true)}
      className="px-4 py-2 text-sm font-medium text-red-700 bg-white border border-red-300 rounded-md shadow-sm hover:bg-red-50"
    >
      Delete
    </button>
  );
}

"use client";

import { ViewTransition } from "react";
import type { ReactNode } from "react";

interface RecipeTitleTransitionProps {
  recipeId: string;
  children: ReactNode;
}

export function RecipeTitleTransition({
  recipeId,
  children,
}: RecipeTitleTransitionProps) {
  return (
    <ViewTransition
      name={`recipe-title-${recipeId}`}
      share="recipe-title-transition"
    >
      {children}
    </ViewTransition>
  );
}

interface RecipeImageTransitionProps {
  recipeId: string;
  children: ReactNode;
}

export function RecipeImageTransition({
  recipeId,
  children,
}: RecipeImageTransitionProps) {
  return (
    <ViewTransition
      name={`recipe-image-${recipeId}`}
      share="recipe-image-transition"
    >
      {children}
    </ViewTransition>
  );
}

import { ViewTransition } from "react";

export default function RecipesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ViewTransition default="recipes-page-transition">
      {children}
    </ViewTransition>
  );
}

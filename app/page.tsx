import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <main className="flex flex-col items-center gap-8 px-4 text-center">
        <div className="flex flex-col items-center gap-2">
          <span className="text-6xl">🍽️</span>
          <h1 className="text-4xl font-bold tracking-tight">QRecipe</h1>
          <p className="max-w-md text-lg text-muted-foreground">
            Store and organize your favorite recipes in one place
          </p>
        </div>
        <div className="flex gap-4">
          <Button asChild>
            <Link href="/signin">Sign In</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/recipes">View Recipes</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}

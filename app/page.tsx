import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() });
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <main className="flex flex-col items-center gap-8 px-4 text-center">
        <div className="flex flex-col items-center gap-2">
          <Image
            src="/chef.png"
            alt="QRecipe logo"
            width={200}
            height={200}
            priority
          />
          <h1 className="text-4xl font-bold tracking-tight">QRecipe</h1>
          <p className="max-w-md text-lg text-muted-foreground">
            Store and organize your favorite recipes in one place
          </p>
        </div>
        <div className="flex gap-4">
          {session ? null : (
            <Button asChild>
              <Link href="/signin">Sign In</Link>
            </Button>
          )}
          <Button variant="outline" asChild>
            <Link href="/recipes">View Recipes</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}

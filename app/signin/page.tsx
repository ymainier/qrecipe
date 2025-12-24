import { headers } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SignInPageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session) {
    redirect("/recipes");
  }

  const { error } = await searchParams;

  async function signIn(formData: FormData) {
    "use server";
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      await auth.api.signInEmail({
        headers: await headers(),
        body: { email, password },
      });
    } catch (e) {
      const message = e instanceof Error ? e.message : "Sign in failed";
      redirect(`/signin?error=${encodeURIComponent(message)}`);
    }

    redirect("/recipes");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link href="/" className="mb-2 flex justify-center">
            <Image
              src="/chef.png"
              alt="QRecipe logo"
              width={64}
              height={64}
              priority
            />
          </Link>
          <CardTitle className="text-2xl">Sign in to QRecipe</CardTitle>
          <CardDescription>
            Enter your credentials to access your recipes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" action={signIn}>
            {error ? (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : null}
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Sign in
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

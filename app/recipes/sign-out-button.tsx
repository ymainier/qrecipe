import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export function SignOutButton() {
  async function signOut() {
    "use server";
    await auth.api.signOut({
      headers: await headers(),
    });
    redirect("/signin");
  }

  return (
    <form action={signOut}>
      <button
        type="submit"
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
      >
        Sign out
      </button>
    </form>
  );
}

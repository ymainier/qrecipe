import { config } from "dotenv";
config({ path: ".env.local" });

import { randomBytes } from "crypto";
import { hashPassword } from "better-auth/crypto";

function generatePassword(): string {
  return randomBytes(12).toString("base64").slice(0, 16);
}

function parseUsersSeed(seed: string): Array<{ name: string; email: string }> {
  return seed.split(",").map((entry) => {
    const [name, email] = entry.trim().split("|");
    if (!name || !email) {
      throw new Error(`Invalid seed entry: ${entry}`);
    }
    return { name: name.trim(), email: email.trim() };
  });
}

async function seed() {
  const usersSeed = process.env.USERS_SEED;

  if (!usersSeed) {
    console.log("No USERS_SEED environment variable found. Skipping seed.");
    process.exit(0);
  }

  // Dynamic imports so dotenv runs first
  const { db } = await import("./index");
  const { users, accounts } = await import("./schema");

  console.log("Seeding database...\n");

  const seedUsers = parseUsersSeed(usersSeed);
  const createdUsers: Array<{ name: string; email: string; password: string }> = [];

  for (const { name, email } of seedUsers) {
    const userId = crypto.randomUUID();
    const accountId = crypto.randomUUID();
    const password = generatePassword();

    await db
      .insert(users)
      .values({
        id: userId,
        name,
        email,
        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .onConflictDoNothing();

    await db
      .insert(accounts)
      .values({
        id: accountId,
        accountId: userId,
        providerId: "credential",
        userId,
        password: await hashPassword(password),
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .onConflictDoNothing();

    createdUsers.push({ name, email, password });
  }

  console.log("Seed complete! Created users:\n");
  console.log("┌─────────────────────────────────────────────────────────────────┐");
  for (const { name, email, password } of createdUsers) {
    console.log(`│ ${name}`);
    console.log(`│   Email:    ${email}`);
    console.log(`│   Password: ${password}`);
    console.log("├─────────────────────────────────────────────────────────────────┤");
  }
  console.log("└─────────────────────────────────────────────────────────────────┘");

  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});

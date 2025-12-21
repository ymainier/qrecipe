# CLAUDE.md

## Project Overview

Recipe storage and display application built with Next.js.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Auth:** Better Auth
- **Database:** PostgreSQL
  - Production: Neon
  - Development: Postgres in Docker
  - Tests: Postgres in Docker (separate container)
- **ORM:** Drizzle
- **Deployment:** Vercel

## Project Structure

```
src/
├── app/                  # Next.js App Router pages
├── components/           # React components
├── db/
│   ├── schema.ts         # Drizzle schema definitions
│   ├── index.ts          # DB connection
│   └── migrations/       # Drizzle migrations
├── lib/
│   ├── auth.ts           # Better Auth config
│   └── ...
└── types/                # Shared TypeScript types
```

## Commands

- `pnpm dev` — Start dev server
- `pnpm build` — Production build
- `pnpm test` — Run tests
- `pnpm db:generate` — Generate Drizzle migrations
- `pnpm db:migrate` — Run migrations
- `pnpm db:studio` — Open Drizzle Studio

## Code Style

- Use TypeScript for all files
- Use Prettier with default config
- Use descriptive type names
- Prefer `condition ? 'value' : null` over `condition && 'value'` in JSX
- Prefer function declarations over function expressions
- Use named exports

## Database Schema Guidelines

Core entities:
- **users** — Managed by Better Auth
- **recipes** — title, description, servings, prepTime, cookTime, authorId
- **ingredients** — name, quantity, unit, recipeId
- **steps** — order, instruction, recipeId
- **tags** — name (many-to-many with recipes)

## Environment Variables

```
DATABASE_URL=           # Postgres connection string
BETTER_AUTH_SECRET=     # Auth secret
BETTER_AUTH_URL=        # App URL for auth callbacks
```

## Development Setup

1. Start Postgres: `docker compose up -d`
2. Copy `.env.example` to `.env.local`
3. Run migrations: `pnpm db:migrate`
4. Start dev server: `pnpm dev`

## Notes

- All times (prepTime, cookTime) stored in minutes
- Recipe images stored as URLs (external hosting)
- Soft delete for recipes (deletedAt timestamp)
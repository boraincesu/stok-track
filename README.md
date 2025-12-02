## Stock Tracking Starter

Next.js 14 (App Router) starter that wires together Supabase Postgres, Prisma, NextAuth, and Tailwind UI to deliver:

- Credential-based signup/login flows with client-side validation and hashed passwords
- Protected dashboard route that greets the authenticated user
- API endpoints for account creation plus the built-in NextAuth handler
- Prisma schema for `User`, `Account`, `Session`, and `VerificationToken` models matching the NextAuth adapter expectations

Use this as the foundation for a stock management platform by layering product, warehouse, and transaction features on top of the authenticated scaffold.

## Stack

- Next.js 16 / React 19 with the App Router
- TypeScript + Zod validation
- NextAuth (v4) credentials provider + Prisma adapter
- Supabase-hosted PostgreSQL
- Prisma ORM
- Tailwind v4 (via `@tailwindcss/postcss`)

## Environment Variables

Copy `.env` from the template and set the following secrets:

```env
DATABASE_URL="postgresql://<user>:<password>@<supabase-host>:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://<user>:<password>@<supabase-host>:5432/postgres"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="replace-with-strong-secret"
```

- `DATABASE_URL` points to Supabase connection pooling (pgBouncer) for runtime usage.
- `DIRECT_URL` points to the direct Postgres connection used by Prisma Migrate.
- `NEXTAUTH_SECRET` must be a long random string (e.g., `openssl rand -hex 32`).

## Database & Prisma

1. Adjust the `prisma/schema.prisma` models if you need extra profile fields.
2. Run migrations to create the schema in Supabase:

   ```bash
   npx prisma migrate dev --name init
   ```

3. Whenever you change the schema, regenerate the client:

   ```bash
   npx prisma generate
   ```

## Development

```bash
npm install           # install dependencies
npm run lint          # type-aware linting
npm run dev           # start Next.js (http://localhost:3000)
npm run build         # production build (ensures auth + Prisma wiring)
```

The landing page automatically redirects authenticated users to `/dashboard`. Anonymous users see calls-to-action for `/signup` and `/login`.

## Auth Flow

1. `/signup` performs field validation, hashes the password with `bcryptjs`, stores the record via Prisma, then signs the user in.
2. `/login` uses `next-auth/react` `signIn()` with credentials.
3. Protected pages (`/dashboard`) call `getServerSession(authOptions)` and redirect to `/login` when no session exists.
4. API routes are forced onto the Node.js runtime to ensure compatibility with `bcryptjs` and Prisma.

## Extending the Dashboard

- Add Prisma models for `Product`, `Warehouse`, `InventoryLevel`, etc.
- Build CRUD routes under `app/api` and matching server actions.
- Surface live KPIs in `app/dashboard/page.tsx` by querying Prisma with the authenticated user ID.

This base already solves identity, persistence, and routing so you can focus on stock tracking logic.

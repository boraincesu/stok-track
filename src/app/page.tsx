import Link from "next/link";
import { redirect } from "next/navigation";

import { getServerAuthSession } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function Home() {
  const session = await getServerAuthSession();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-slate-950 px-6 text-center text-white">
      <p className="rounded-full border border-slate-800 px-4 py-1 text-xs uppercase tracking-[0.4em] text-slate-300">
        Stock tracking
      </p>
      <h1 className="max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl">
        Monitor every SKU, supplier, and warehouse from a single dashboard.
      </h1>
      <p className="max-w-2xl text-sm text-slate-300 sm:text-base">
        Secure authentication is ready to go with Supabase Postgres, Prisma, and
        NextAuth. Create an account to start adding locations, products, and
        stock adjustments.
      </p>
      <div className="flex flex-col items-center gap-4 sm:flex-row">
        <Link
          className="w-40 rounded-full bg-indigo-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400"
          href="/signup"
        >
          Sign up
        </Link>
        <Link
          className="w-40 rounded-full border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-white"
          href="/login"
        >
          Log in
        </Link>
      </div>
    </main>
  );
}

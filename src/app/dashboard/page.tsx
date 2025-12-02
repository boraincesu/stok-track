import { redirect } from "next/navigation";

import { getServerAuthSession } from "@/lib/auth";
import { LogoutButton } from "@/components/logout-button";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function DashboardPage() {
  const session = await getServerAuthSession();

  if (!session?.user) {
    redirect("/login");
  }

  const displayName = session.user.name ?? session.user.email;

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.4em] text-slate-400">
              Dashboard
            </p>
            <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">
              Welcome back, {displayName} 👋
            </h1>
            <p className="mt-2 text-slate-300">
              This is a placeholder dashboard. Replace it with stock levels,
              critical alerts, and purchase orders as you continue building the
              system.
            </p>
          </div>
          <LogoutButton />
        </header>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {["Products", "Warehouses", "Reorder Alerts"].map((title) => (
            <article
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow"
              key={title}
            >
              <p className="text-sm text-slate-400">{title}</p>
              <p className="mt-2 text-2xl font-semibold">0</p>
              <p className="mt-1 text-xs text-slate-500">
                Hook this up to your database metrics.
              </p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}

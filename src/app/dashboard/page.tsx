import Image from "next/image";
import { redirect } from "next/navigation";
import { Manrope } from "next/font/google";

import { LogoutButton } from "@/components/logout-button";
import { getServerAuthSession } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export default async function DashboardPage() {
  const session = await getServerAuthSession();

  if (!session?.user) {
    redirect("/login");
  }

  const displayName = session.user.name ?? session.user.email ?? "Member";

  const stats: Array<{
    label: string;
    value?: string;
    delta?: string;
    accent?: string;
  }> = [];
  const lowStock: Array<{ name: string; sku: string; remaining: number }> = [];
  const recentProducts: Array<{
    name: string;
    sku: string;
    price: string;
    quantity: string;
    added: string;
  }> = [];

  return (
    <main
      className={`${manrope.className} flex min-h-screen bg-[#f8fafc] text-[#0f172a]`}
    >
      <aside className="hidden w-64 flex-col border-r border-slate-200 bg-white/95 p-4 shadow-sm lg:flex">
        <div className="flex items-center gap-3 rounded-xl p-3">
          <div className="relative h-8 w-8 overflow-hidden rounded-lg border border-slate-200 bg-white">
            <Image
              alt="Marisonia logo"
              src="/images/mari-logo.webp"
              fill
              sizes="32px"
              className="object-contain"
            />
          </div>
          <span className="text-lg font-bold text-slate-900">Marisonia</span>
        </div>
        <nav className="mt-8 flex flex-1 flex-col gap-2 text-sm font-semibold">
          {["Dashboard", "Products", "Orders", "Reports", "Settings"].map(
            (item, index) => (
              <span
                key={item}
                className={`${
                  index === 0
                    ? "bg-slate-900 text-white"
                    : "text-slate-500 hover:text-slate-900"
                } flex items-center gap-3 rounded-xl px-3 py-2 transition`}
              >
                <span aria-hidden>•</span>
                {item}
              </span>
            )
          )}
        </nav>
        <div className="mt-auto rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
          Need help? Reach out to support.
        </div>
      </aside>

      <section className="flex flex-1 flex-col">
        <header className="flex h-20 items-center justify-between gap-4 border-b border-slate-200 bg-white/90 px-6 backdrop-blur">
          <div className="flex items-center gap-3 lg:hidden">
            <div className="relative h-9 w-9 overflow-hidden rounded-xl border border-slate-200 bg-white">
              <Image
                alt="Marisonia logo"
                src="/images/mari-logo.webp"
                fill
                sizes="36px"
                className="object-contain"
              />
            </div>
            <span className="text-base font-semibold">Marisonia</span>
          </div>
          <label className="relative flex h-12 w-full max-w-md items-center">
            <span
              className="pointer-events-none absolute left-3 text-slate-400"
              aria-hidden
            >
              🔍
            </span>
            <input
              className="h-full w-full rounded-2xl border border-slate-200 bg-slate-50 pl-10 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white"
              placeholder="Search products, orders..."
              type="search"
            />
          </label>
          <div className="flex items-center gap-4">
            <button
              className="relative flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:text-slate-900"
              type="button"
            >
              🔔
              <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-rose-500" />
            </button>
            <div className="hidden h-11 w-11 items-center justify-center rounded-full bg-blue-50 text-blue-700 sm:flex">
              {displayName.slice(0, 2).toUpperCase()}
            </div>
            <LogoutButton />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="mt-1 text-sm text-slate-500">
                Welcome back, {displayName}. Here is your inventory snapshot.
              </p>
            </div>
            <button
              className="flex h-11 items-center gap-2 rounded-full bg-slate-900 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
              type="button"
            >
              <span aria-hidden>＋</span>
              Add New Product
            </button>
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {stats.length > 0 ? (
              stats.map((stat) => (
                <article
                  key={stat.label}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <p className="text-sm text-slate-500">{stat.label}</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-900">
                    {stat.value}
                  </p>
                  {stat.delta ? (
                    <p
                      className={`mt-2 text-xs font-medium ${
                        stat.accent ?? "text-slate-500"
                      }`}
                    >
                      {stat.delta}
                    </p>
                  ) : null}
                </article>
              ))
            ) : (
              <article className="col-span-full rounded-2xl border border-dashed border-slate-300 bg-white/80 p-6 text-sm text-slate-500">
                <p className="font-semibold text-slate-700">
                  No analytics available yet.
                </p>
                <p className="mt-1 text-slate-500">
                  Connect your inventory data source to unlock live metrics.
                </p>
              </article>
            )}
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            <section className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-lg font-semibold">
                    Stock levels over time
                  </h2>
                  <p className="text-sm text-slate-500">Last 30 days</p>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-[#f6f7f8] p-1 text-sm">
                  {[
                    { label: "Monthly", active: true },
                    { label: "Weekly", active: false },
                    { label: "Daily", active: false },
                  ].map(({ label, active }) => (
                    <button
                      key={label}
                      className={`${
                        active
                          ? "bg-white font-semibold text-blue-600"
                          : "text-slate-500"
                      } rounded-full px-3 py-1`}
                      type="button"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-4 h-72">
                <svg
                  viewBox="0 0 540 300"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-full w-full"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient
                      id="chartGradient"
                      x1="0"
                      x2="0"
                      y1="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#137fec" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#137fec" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0 200 C40 150, 80 160, 120 120 S200 20, 240 80 S320 220, 360 180 S440 100, 480 150 S520 220, 540 200 L540 300 L0 300 Z"
                    fill="url(#chartGradient)"
                  />
                  <path
                    d="M0 200 C40 150, 80 160, 120 120 S200 20, 240 80 S320 220, 360 180 S440 100, 480 150 S520 220, 540 200"
                    fill="none"
                    stroke="#137fec"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold">Low stock alerts</h2>
              <p className="text-sm text-slate-500">
                Items that need to be reordered soon.
              </p>
              {lowStock.length > 0 ? (
                <>
                  <div className="mt-4 space-y-4">
                    {lowStock.map((item) => (
                      <div
                        key={item.sku}
                        className="flex items-center justify-between"
                      >
                        <div>
                          <p className="text-sm font-medium">{item.name}</p>
                          <p className="text-xs text-slate-500">
                            SKU: {item.sku}
                          </p>
                        </div>
                        <div className="text-right">
                          <p
                            className={`text-sm font-semibold ${
                              item.remaining <= 8
                                ? "text-rose-500"
                                : "text-orange-500"
                            }`}
                          >
                            {item.remaining}
                          </p>
                          <p className="text-xs text-slate-500">in stock</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    className="mt-6 w-full rounded-full bg-slate-900 py-2 text-sm font-semibold text-white"
                    type="button"
                  >
                    View all
                  </button>
                </>
              ) : (
                <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
                  No low-stock alerts right now.
                </div>
              )}
            </section>
          </div>

          <section className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="p-6">
              <h2 className="text-lg font-semibold">
                Recent product additions
              </h2>
              <p className="text-sm text-slate-500">
                The latest products added to your inventory.
              </p>
            </div>
            {recentProducts.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                    <tr>
                      <th className="px-6 py-3">Product name</th>
                      <th className="px-6 py-3">SKU</th>
                      <th className="px-6 py-3">Price</th>
                      <th className="px-6 py-3">Quantity</th>
                      <th className="px-6 py-3">Date added</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentProducts.map((product) => (
                      <tr
                        key={product.sku}
                        className="border-t border-slate-100"
                      >
                        <th className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900">
                          {product.name}
                        </th>
                        <td className="px-6 py-4 text-slate-500">
                          {product.sku}
                        </td>
                        <td className="px-6 py-4 text-slate-500">
                          {product.price}
                        </td>
                        <td className="px-6 py-4 text-slate-500">
                          {product.quantity}
                        </td>
                        <td className="px-6 py-4 text-slate-500">
                          {product.added}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="px-6 pb-8 text-sm text-slate-500">
                No products have been added yet. Once you start tracking items,
                they will appear here.
              </div>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}

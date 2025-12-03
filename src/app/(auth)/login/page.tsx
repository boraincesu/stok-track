"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useMemo, useState } from "react";
import { signIn } from "next-auth/react";
import { Manrope } from "next/font/google";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-manrope",
});

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const backgroundStyle = useMemo(
    () => ({
      backgroundImage:
        "linear-gradient(120deg, rgba(15,23,42,0.85), rgba(15,23,42,0.6)), url('https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=1600&q=80')",
      backgroundPosition: "left center",
      backgroundSize: "cover",
    }),
    []
  );

  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
        return;
      }

      router.replace(callbackUrl);
      router.refresh();
    } catch (authError) {
      console.error(authError);
      setError("Unexpected error while logging in");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main
      className={`${manrope.className} min-h-screen bg-[#f6f7f8] text-slate-900`}
    >
      <div className="flex min-h-screen flex-col bg-[#f6f7f8] lg:flex-row">
        {/* Left branding panel */}
        <aside className="relative hidden w-1/2 overflow-hidden lg:flex">
          <div className="absolute inset-0" aria-hidden>
            <div className="h-full w-full" style={backgroundStyle} />
          </div>
          <div className="relative z-10 flex h-full w-full flex-col justify-between bg-gradient-to-r from-slate-950/80 via-slate-900/70 to-slate-900/20 px-10 py-12 text-white">
            <div className="flex items-center gap-3 text-white">
              <img
                src="/images/mari-logo.webp"
                alt="Marisonia Logo"
                className="h-10 w-10 rounded-lg"
              />
              <span className="text-2xl font-bold tracking-tight">
                Marisonia Stok Takip
              </span>
            </div>
            <div className="space-y-4">
              <h2 className="text-4xl font-black leading-tight xl:text-5xl">
                Streamline your inventory. Maximize your efficiency.
              </h2>
              <p className="text-base text-slate-200">
                The ultimate stock tracking solution for modern businesses.
              </p>
            </div>
          </div>
        </aside>

        {/* Right form panel */}
        <section className="flex w-full flex-1 items-center justify-center bg-[#f6f7f8] px-4 py-12 sm:px-8 lg:px-12">
          <div className="w-full max-w-md space-y-8">
            <header className="space-y-2">
              <p className="text-sm font-semibold uppercase tracking-[0.4em] text-slate-500">
                Access portal
              </p>
              <h1 className="text-3xl font-bold tracking-tight">
                Sign in to your account
              </h1>
              <p className="text-base text-slate-600">
                Welcome back! Please enter your details.
              </p>
            </header>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <label className="block space-y-2 text-sm font-medium text-slate-800">
                Email
                <div className="flex items-center rounded-2xl border border-slate-300 bg-white px-4 transition focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100">
                  <span aria-hidden className="text-slate-400">
                    ✉️
                  </span>
                  <input
                    className="h-12 flex-1 bg-transparent px-3 text-base text-slate-900 outline-none"
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </div>
              </label>

              <label className="block space-y-2 text-sm font-medium text-slate-800">
                Password
                <div className="flex items-center rounded-2xl border border-slate-300 bg-white px-4 transition focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100">
                  <span aria-hidden className="text-slate-400">
                    🔒
                  </span>
                  <input
                    className="h-12 flex-1 bg-transparent px-3 text-base text-slate-900 outline-none"
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    required
                    minLength={8}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                </div>
              </label>

              {error ? (
                <p
                  className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600"
                  role="alert"
                >
                  {error}
                </p>
              ) : null}

              <div className="flex items-center justify-end text-sm font-medium">
                <Link
                  className="text-blue-600 hover:text-blue-500"
                  href="/forgot-password"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                className="flex h-14 w-full items-center justify-center rounded-2xl bg-blue-600 text-base font-semibold text-white transition hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-70"
                disabled={isSubmitting}
                type="submit"
              >
                {isSubmitting ? "Signing in..." : "Login"}
              </button>
            </form>

            <p className="text-center text-sm text-slate-600">
              Need an account?{" "}
              <Link
                className="font-semibold text-blue-600 hover:text-blue-500"
                href="/signup"
              >
                Sign up
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f6f7f8]" />}>
      <LoginForm />
    </Suspense>
  );
}

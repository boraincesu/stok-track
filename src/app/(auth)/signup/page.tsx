"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import { signIn } from "next-auth/react";
import { Manrope } from "next/font/google";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-manrope",
});

interface FormState {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const initialState: FormState = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export default function SignupPage() {
  const router = useRouter();
  const [formValues, setFormValues] = useState<FormState>(initialState);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const heroStyle = useMemo(
    () => ({
      backgroundImage:
        "url('https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1100&q=80')",
    }),
    []
  );

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (formValues.password !== formValues.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formValues),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message ?? "Unable to create account");
        return;
      }

      const result = await signIn("credentials", {
        email: formValues.email,
        password: formValues.password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
        return;
      }

      router.replace("/dashboard");
      router.refresh();
    } catch (signupError) {
      console.error(signupError);
      setError("Unexpected error while signing up");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main
      className={`${manrope.className} min-h-screen bg-[#F7F9FC] text-[#0d141b]`}
    >
      <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
        <div className="relative hidden items-center justify-center bg-slate-100 p-8 md:flex">
          <div
            aria-hidden
            className="h-full w-full rounded-3xl bg-cover bg-center"
            style={heroStyle}
          />
        </div>

        <section className="flex w-full items-center justify-center px-6 py-12 sm:px-12">
          <div className="w-full max-w-md space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <svg
                  className="h-9 w-9 text-blue-500"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden
                >
                  <path d="M12 2 2 7l10 5 10-5-10-5Z" />
                  <path d="M2 12v5l10 5 10-5v-5" />
                  <path d="M2 12 12 7l10 5" />
                </svg>
                <h1 className="text-2xl font-bold tracking-tight">Marisonia</h1>
              </div>
              <header className="space-y-2">
                <p className="text-4xl font-black leading-tight tracking-tight">
                  Create your account
                </p>
                <p className="text-base text-[#4c739a]">
                  Start managing your inventory with ease.
                </p>
              </header>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <label className="block space-y-2 text-base font-medium">
                Full name
                <input
                  className="h-14 w-full rounded-2xl border border-[#cfdbe7] bg-[#F7F9FC] px-4 text-base text-[#0d141b] outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  required
                  minLength={2}
                  value={formValues.name}
                  onChange={handleChange}
                />
              </label>

              <label className="block space-y-2 text-base font-medium">
                Work email
                <input
                  className="h-14 w-full rounded-2xl border border-[#cfdbe7] bg-[#F7F9FC] px-4 text-base text-[#0d141b] outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your work email"
                  required
                  value={formValues.email}
                  onChange={handleChange}
                />
              </label>

              <label className="block space-y-2 text-base font-medium">
                Password
                <div className="flex rounded-2xl border border-[#cfdbe7] bg-[#F7F9FC]">
                  <input
                    className="h-14 w-full flex-1 rounded-l-2xl border-r border-r-transparent bg-transparent px-4 text-base text-[#0d141b] outline-none"
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    required
                    minLength={8}
                    value={formValues.password}
                    onChange={handleChange}
                  />
                  <span
                    className="flex items-center px-4 text-[#4c739a]"
                    aria-hidden
                  >
                    👁‍🗨
                  </span>
                </div>
              </label>

              <label className="block space-y-2 text-base font-medium">
                Confirm password
                <input
                  className="h-14 w-full rounded-2xl border border-[#cfdbe7] bg-[#F7F9FC] px-4 text-base text-[#0d141b] outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  required
                  minLength={8}
                  value={formValues.confirmPassword}
                  onChange={handleChange}
                />
              </label>

              {error ? (
                <p
                  className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600"
                  role="alert"
                >
                  {error}
                </p>
              ) : null}

              <button
                className="flex h-14 w-full items-center justify-center rounded-2xl bg-blue-600 text-base font-semibold text-white transition hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-70"
                disabled={isSubmitting}
                type="submit"
              >
                {isSubmitting ? "Creating account..." : "Sign up"}
              </button>
            </form>

            <div className="space-y-3 text-center text-sm text-[#4c739a]">
              <p>
                Already have an account?{" "}
                <Link
                  className="font-semibold text-blue-600 hover:text-blue-500"
                  href="/login"
                >
                  Log in
                </Link>
              </p>
              <p className="text-xs text-slate-500">
                By signing up, you agree to our{" "}
                <Link className="underline hover:text-blue-600" href="#">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link className="underline hover:text-blue-600" href="#">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

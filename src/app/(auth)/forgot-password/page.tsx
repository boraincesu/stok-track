"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

interface StatusState {
  message: string;
  variant: "success" | "error";
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<StatusState | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          typeof data.message === "string"
            ? data.message
            : "We couldn't send the reset email."
        );
      }

      setStatus({
        variant: "success",
        message:
          typeof data.message === "string"
            ? data.message
            : "Check your inbox for the reset link.",
      });
    } catch (error) {
      const fallbackMessage =
        error instanceof Error ? error.message : "Unexpected error occurred.";
      setStatus({ variant: "error", message: fallbackMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,#e8f0ff,#f7f9fc)] px-4 py-12">
      <div className="w-full max-w-md space-y-6 rounded-3xl border border-slate-200 bg-white/95 p-8 text-slate-900 shadow-[0_25px_80px_rgba(15,23,42,0.08)]">
        <div className="space-y-1 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
            Credential recovery
          </p>
          <h1 className="text-3xl font-semibold text-slate-900">
            Forgot your password?
          </h1>
          <p className="text-sm text-slate-600">
            Enter the email linked to your account and we'll send you a secure
            reset link.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label
              className="text-sm font-medium text-slate-700"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
            />
          </div>

          {status ? (
            <div
              aria-live="polite"
              className={`rounded-xl border px-3 py-2 text-sm ${
                status.variant === "success"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-rose-200 bg-rose-50 text-rose-600"
              }`}
            >
              {status.message}
            </div>
          ) : null}

          <button
            className="w-full rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Sending link..." : "Reset password"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-600">
          Remembered your password?{" "}
          <Link
            className="font-semibold text-blue-700 hover:text-blue-600"
            href="/login"
          >
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { FormEvent, Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

interface StatusState {
  message: string;
  variant: "success" | "error";
}

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<StatusState | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const tokenMissing = useMemo(() => token.length === 0, [token]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);

    if (password !== confirmPassword) {
      setStatus({ variant: "error", message: "Passwords do not match." });
      return;
    }

    if (tokenMissing) {
      setStatus({
        variant: "error",
        message: "Reset link is missing or invalid.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          typeof data.message === "string"
            ? data.message
            : "Unable to update password."
        );
      }

      setPassword("");
      setConfirmPassword("");
      setStatus({
        variant: "success",
        message: "Your password has been updated. You can now log in.",
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
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_#e8f0ff,_#f7f9fc)] px-4 py-12">
      <div className="w-full max-w-md space-y-6 rounded-3xl border border-slate-200 bg-white/95 p-8 text-slate-900 shadow-[0_25px_80px_rgba(15,23,42,0.08)]">
        <div className="space-y-1 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
            Secure reset
          </p>
          <h1 className="text-3xl font-semibold text-slate-900">
            Set a new password
          </h1>
          <p className="text-sm text-slate-600">
            Choose a strong password to protect your inventory workspace.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label
              className="text-sm font-medium text-slate-700"
              htmlFor="password"
            >
              New password
            </label>
            <input
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter a new password"
            />
          </div>

          <div className="space-y-1">
            <label
              className="text-sm font-medium text-slate-700"
              htmlFor="confirmPassword"
            >
              Confirm password
            </label>
            <input
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              minLength={8}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Re-enter your new password"
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
            className="w-full rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Updating password..." : "Update password"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-600">
          Remember your credentials?{" "}
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

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_#e8f0ff,_#f7f9fc)]">
          <div className="animate-pulse text-slate-500">Loading...</div>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}

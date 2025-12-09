"use client";

import { signOut } from "next-auth/react";
import { useTransition } from "react";

export function LogoutButton() {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(() => {
      void signOut({ callbackUrl: "/login" });
    });
  };

  return (
    <button
      className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
      onClick={handleLogout}
      type="button"
      disabled={isPending}
    >
      {isPending ? "Signing out..." : "Log out"}
    </button>
  );
}

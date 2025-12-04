import { redirect } from "next/navigation";

import { getServerAuthSession } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function Home() {
  const session = await getServerAuthSession();

  if (session?.user) {
    redirect("/dashboard");
  }

  redirect("/login");
}

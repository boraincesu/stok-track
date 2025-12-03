import { redirect } from "next/navigation";

import { getServerAuthSession } from "@/lib/auth";
import { DashboardClient } from "@/components/dashboard/DashboardClient";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function DashboardPage() {
  const session = await getServerAuthSession();

  if (!session?.user) {
    redirect("/login");
  }

  return <DashboardClient />;
}

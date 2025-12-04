"use client";

import Image from "next/image";
import { signOut, useSession } from "next-auth/react";

const MENU = [
  { id: "dashboard", icon: "dashboard", label: "Dashboard" },
  { id: "products", icon: "inventory", label: "Products" },
  { id: "orders", icon: "receipt_long", label: "Orders" },
  { id: "reports", icon: "assessment", label: "Reports" },
  { id: "settings", icon: "settings", label: "Settings" },
] as const;

export type SidebarTab = (typeof MENU)[number]["id"];

interface SidebarProps {
  activeTab: SidebarTab;
  setActiveTab: (tab: SidebarTab) => void;
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const { data: session } = useSession();
  
  const userName = session?.user?.name || "Kullanıcı";
  const userEmail = session?.user?.email || "";
  const userImage = session?.user?.image;
  
  // Generate initials for avatar fallback
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <aside className="hidden w-64 flex-col bg-card-light p-4 border-r border-border-light md:flex sticky top-0 h-screen overflow-y-auto">
      <div className="flex items-center gap-3 px-2 mb-8">
        <Image
          src="/images/mari-logo.webp"
          alt="Marisonia Logo"
          width={40}
          height={40}
          className="rounded-lg"
        />
        <h1 className="text-xl font-bold text-text-light-primary">
          Marisonia Stok Takip
        </h1>
      </div>

      <div className="flex flex-col gap-4 flex-1">
        <div className="flex flex-col gap-2">
          {MENU.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
                  isActive
                    ? "bg-primary/20 text-primary"
                    : "hover:bg-primary/10 text-text-light-secondary"
                }`}
              >
                <span
                  className={`material-symbols-outlined ${
                    !isActive ? "text-text-light-secondary" : ""
                  }`}
                >
                  {item.icon}
                </span>
                <p
                  className={`text-sm ${
                    isActive ? "font-bold" : "font-medium"
                  }`}
                >
                  {item.label}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-3 p-2 rounded-lg mt-auto">
        {userImage ? (
          <div
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
            style={{ backgroundImage: `url("${userImage}")` }}
          />
        ) : (
          <div className="flex items-center justify-center size-10 rounded-full bg-primary/20 text-primary font-semibold text-sm">
            {initials}
          </div>
        )}
        <div className="flex flex-col overflow-hidden">
          <h1 className="text-text-light-primary text-sm font-medium leading-normal truncate">
            {userName}
          </h1>
          <p className="text-text-light-secondary text-xs font-normal leading-normal truncate">
            {userEmail}
          </p>
        </div>
        <button
          type="button"
          className="ml-auto p-1 hover:bg-gray-100 rounded"
          aria-label="Log out"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          <span className="material-symbols-outlined text-text-light-secondary text-[20px]">
            logout
          </span>
        </button>
      </div>
    </aside>
  );
}

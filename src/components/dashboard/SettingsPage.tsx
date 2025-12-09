"use client";

import { useCallback, useEffect, useState } from "react";
import type { UserSettings, NotificationSettings } from "@/types/settings";

interface SettingsPageProps {
  onNotificationChange?: (settings: NotificationSettings) => void;
}

export function SettingsPage({ onNotificationChange }: SettingsPageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "User",
    avatar: "https://i.pravatar.cc/120?img=12",
  });

  const [notifications, setNotifications] = useState<NotificationSettings>({
    orderAlerts: true,
    lowStockWarnings: true,
    weeklyReports: false,
  });

  const [editForm, setEditForm] = useState(profile);

  const fetchSettings = useCallback(async () => {
    try {
      const response = await fetch("/api/settings");
      if (response.ok) {
        const data: UserSettings = await response.json();
        setProfile({
          fullName: data.profile.fullName,
          email: data.profile.email,
          phone: data.profile.phone,
          role: data.profile.role,
          avatar: data.profile.avatar || "https://i.pravatar.cc/120?img=12",
        });
        setEditForm({
          fullName: data.profile.fullName,
          email: data.profile.email,
          phone: data.profile.phone,
          role: data.profile.role,
          avatar: data.profile.avatar || "https://i.pravatar.cc/120?img=12",
        });
        setNotifications(data.notifications);
        onNotificationChange?.(data.notifications);
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    } finally {
      setIsLoading(false);
    }
  }, [onNotificationChange]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile: {
            fullName: editForm.fullName,
            phone: editForm.phone,
          },
        }),
      });

      if (response.ok) {
        const data: UserSettings = await response.json();
        setProfile({
          fullName: data.profile.fullName,
          email: data.profile.email,
          phone: data.profile.phone,
          role: data.profile.role,
          avatar: data.profile.avatar || profile.avatar,
        });
        setIsEditing(false);
      } else {
        alert("Profil güncellenirken bir hata oluştu");
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Sunucuya bağlanılamadı");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditForm(profile);
    setIsEditing(false);
  };

  const handleNotificationChange = async (key: keyof NotificationSettings) => {
    const newValue = !notifications[key];
    const updatedNotifications = { ...notifications, [key]: newValue };

    setNotifications(updatedNotifications);
    onNotificationChange?.(updatedNotifications);

    try {
      await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          notifications: { [key]: newValue },
        }),
      });
    } catch (error) {
      console.error("Failed to update notification setting:", error);
      // Revert on error
      setNotifications(notifications);
      onNotificationChange?.(notifications);
    }
  };

  if (isLoading) {
    return (
      <section className="flex max-w-4xl flex-col gap-8">
        <header>
          <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-64 bg-gray-200 rounded animate-pulse mt-2" />
        </header>
        <div className="rounded-2xl border border-border-light bg-card-light p-6 shadow-sm">
          <div className="h-6 w-40 bg-gray-200 rounded animate-pulse" />
          <div className="mt-6 flex flex-col gap-8 md:flex-row">
            <div className="size-24 rounded-full bg-gray-200 animate-pulse" />
            <div className="grid flex-1 grid-cols-1 gap-6 md:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                  <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="flex max-w-4xl flex-col gap-8">
      <header>
        <h2 className="text-xl font-bold text-text-light-primary">Settings</h2>
        <p className="text-sm text-text-light-secondary">
          Manage your profile, alerts, and workspace preferences.
        </p>
      </header>

      <article className="rounded-2xl border border-border-light bg-card-light p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-text-light-primary">
            Profile Information
          </h3>
          {!isEditing && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition"
            >
              <span className="material-symbols-outlined text-[18px]">
                edit
              </span>
              Edit
            </button>
          )}
        </div>
        <div className="mt-6 flex flex-col gap-8 md:flex-row">
          <div className="relative">
            <div
              className="size-24 rounded-full bg-cover bg-center"
              style={{
                backgroundImage: `url("${profile.avatar}")`,
              }}
            />
            {isEditing && (
              <button
                type="button"
                className="absolute bottom-0 right-0 rounded-full bg-primary text-white p-1.5 shadow-lg hover:bg-primary/90 transition"
                aria-label="Edit avatar"
              >
                <span className="material-symbols-outlined text-sm">edit</span>
              </button>
            )}
          </div>
          <div className="grid flex-1 grid-cols-1 gap-6 md:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm font-semibold text-text-light-primary">
              Full Name
              <input
                className={`rounded-lg border border-border-light bg-background-light px-3 py-2 text-sm font-normal text-text-light-primary outline-none transition focus:border-primary focus:ring-1 focus:ring-primary ${
                  !isEditing ? "cursor-not-allowed bg-gray-50" : ""
                }`}
                value={isEditing ? editForm.fullName : profile.fullName}
                onChange={(e) =>
                  setEditForm({ ...editForm, fullName: e.target.value })
                }
                disabled={!isEditing}
                type="text"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-semibold text-text-light-primary">
              Email Address
              <input
                className="rounded-lg border border-border-light bg-gray-50 px-3 py-2 text-sm font-normal text-text-light-secondary outline-none cursor-not-allowed"
                value={profile.email}
                disabled
                type="email"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-semibold text-text-light-primary">
              Phone Number
              <input
                className={`rounded-lg border border-border-light bg-background-light px-3 py-2 text-sm font-normal text-text-light-primary outline-none transition focus:border-primary focus:ring-1 focus:ring-primary ${
                  !isEditing ? "cursor-not-allowed bg-gray-50" : ""
                }`}
                value={isEditing ? editForm.phone : profile.phone}
                onChange={(e) =>
                  setEditForm({ ...editForm, phone: e.target.value })
                }
                disabled={!isEditing}
                type="tel"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-semibold text-text-light-primary">
              Role
              <input
                className="rounded-lg border border-border-light bg-gray-50 px-3 py-2 text-sm font-normal text-text-light-secondary outline-none cursor-not-allowed"
                value={profile.role}
                disabled
                type="text"
              />
            </label>
            {isEditing && (
              <div className="md:col-span-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="rounded-lg border border-border-light px-5 py-2 text-sm font-semibold text-text-light-secondary transition hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90 disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}
          </div>
        </div>
      </article>

      <article className="rounded-2xl border border-border-light bg-card-light p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-text-light-primary">
          Notifications
        </h3>
        <p className="text-sm text-text-light-secondary mt-1">
          These settings control which alerts are shown on your dashboard.
        </p>
        <div className="mt-6 space-y-4">
          {[
            {
              key: "orderAlerts" as const,
              title: "Order Alerts",
              description: "Get notified when a new order is placed.",
              icon: "shopping_cart",
            },
            {
              key: "lowStockWarnings" as const,
              title: "Low Stock Warnings",
              description: "Receive alerts when inventory drops below targets.",
              icon: "inventory_2",
            },
            {
              key: "weeklyReports" as const,
              title: "Weekly Reports",
              description: "Receive a weekly summary of sales and inventory.",
              icon: "bar_chart",
            },
          ].map((item, index) => (
            <div
              key={item.key}
              className={`flex items-center justify-between py-3 ${
                index === 0 ? "" : "border-t border-border-light"
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-text-light-secondary text-[20px] mt-0.5">
                  {item.icon}
                </span>
                <div>
                  <p className="font-medium text-text-light-primary">
                    {item.title}
                  </p>
                  <p className="text-sm text-text-light-secondary">
                    {item.description}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleNotificationChange(item.key)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                  notifications[item.key] ? "bg-primary" : "bg-gray-200"
                }`}
                role="switch"
                aria-checked={notifications[item.key]}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    notifications[item.key] ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}

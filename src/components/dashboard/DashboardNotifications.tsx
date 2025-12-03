"use client";

import type { NotificationSettings } from "@/types/settings";
import type { Order, Product } from "@/types/dashboard";

interface DashboardNotificationsProps {
  orders: Order[];
  products: Product[];
  settings: NotificationSettings;
  onDismiss?: (id: string) => void;
}

interface Notification {
  id: string;
  type: "order" | "lowStock" | "report";
  title: string;
  message: string;
  icon: string;
  color: string;
  time: string;
}

export function DashboardNotifications({
  orders,
  products,
  settings,
}: DashboardNotificationsProps) {
  const notifications: Notification[] = [];

  // Order Alerts - son 24 saatteki yeni siparişler
  if (settings.orderAlerts) {
    const recentOrders = orders.filter((order) => {
      const orderDate = new Date(order.date);
      const now = new Date();
      const diffHours =
        (now.getTime() - orderDate.getTime()) / (1000 * 60 * 60);
      return diffHours <= 24 && order.status === "Pending";
    });

    recentOrders.slice(0, 3).forEach((order) => {
      notifications.push({
        id: `order-${order.id}`,
        type: "order",
        title: "New Order",
        message: `Order #${order.id.slice(0, 8)} from ${
          order.customer
        } - $${order.amount.toFixed(2)}`,
        icon: "shopping_cart",
        color: "bg-blue-100 text-blue-600",
        time: formatTimeAgo(new Date(order.date)),
      });
    });
  }

  // Low Stock Warnings
  if (settings.lowStockWarnings) {
    const lowStockProducts = products.filter(
      (p) => p.status === "Low Stock" || p.status === "Out of Stock"
    );

    lowStockProducts.slice(0, 3).forEach((product) => {
      notifications.push({
        id: `stock-${product.id}`,
        type: "lowStock",
        title:
          product.status === "Out of Stock"
            ? "Out of Stock"
            : "Low Stock Warning",
        message: `${product.name} - ${product.stock} units remaining`,
        icon: product.status === "Out of Stock" ? "error" : "warning",
        color:
          product.status === "Out of Stock"
            ? "bg-red-100 text-red-600"
            : "bg-orange-100 text-orange-600",
        time: "Now",
      });
    });
  }

  // Weekly Reports notification (if enabled and it's Monday)
  if (settings.weeklyReports) {
    const today = new Date();
    if (today.getDay() === 1) {
      // Monday
      const totalRevenue = orders
        .filter((o) => o.status === "Completed")
        .reduce((sum, o) => sum + o.amount, 0);

      notifications.push({
        id: "weekly-report",
        type: "report",
        title: "Weekly Report Ready",
        message: `Last week: $${totalRevenue.toLocaleString()} revenue, ${
          orders.length
        } orders`,
        icon: "bar_chart",
        color: "bg-purple-100 text-purple-600",
        time: "Today",
      });
    }
  }

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-border-light bg-card-light p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-light-primary flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px]">
            notifications
          </span>
          Notifications
        </h3>
        <span className="text-xs font-medium text-white bg-primary rounded-full px-2 py-0.5">
          {notifications.length}
        </span>
      </div>
      <div className="space-y-3">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="flex items-start gap-3 p-3 rounded-xl bg-background-light hover:bg-gray-100 transition-colors"
          >
            <div className={`p-2 rounded-lg ${notification.color}`}>
              <span className="material-symbols-outlined text-[18px]">
                {notification.icon}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-light-primary">
                {notification.title}
              </p>
              <p className="text-xs text-text-light-secondary truncate">
                {notification.message}
              </p>
            </div>
            <span className="text-xs text-text-light-secondary whitespace-nowrap">
              {notification.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return date.toLocaleDateString();
}

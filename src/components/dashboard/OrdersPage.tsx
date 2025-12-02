import { useMemo } from "react";

import type { Order } from "@/types/dashboard";

interface OrdersPageProps {
  orders: Order[];
  searchTerm: string;
}

const STATUS_STYLES: Record<Order["status"], string> = {
  Completed: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Pending: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  Canceled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export function OrdersPage({ orders, searchTerm }: OrdersPageProps) {
  const filteredOrders = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase();
    if (!normalized) return orders;
    return orders.filter((order) =>
      [order.id, order.customer].some((value) => value.toLowerCase().includes(normalized))
    );
  }, [orders, searchTerm]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-text-light-primary dark:text-dark-primary">All Orders</h2>
        <div className="flex gap-2">
          <button className="px-4 py-2 text-sm font-medium text-text-light-secondary border border-border-light dark:border-border-dark rounded-lg hover:bg-background-light dark:hover:bg-card-dark transition-colors">
            Date Range
          </button>
          <button className="px-4 py-2 text-sm font-medium text-text-light-secondary border border-border-light dark:border-border-dark rounded-lg hover:bg-background-light dark:hover:bg-card-dark transition-colors">
            Status
          </button>
        </div>
      </div>

      <div className="bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-background-light dark:bg-background-dark border-b border-border-light dark:border-border-dark">
                <th className="p-4 text-sm font-bold text-text-light-secondary dark:text-dark-secondary">Order ID</th>
                <th className="p-4 text-sm font-bold text-text-light-secondary dark:text-dark-secondary">Customer</th>
                <th className="p-4 text-sm font-bold text-text-light-secondary dark:text-dark-secondary">Date</th>
                <th className="p-4 text-sm font-bold text-text-light-secondary dark:text-dark-secondary">Amount</th>
                <th className="p-4 text-sm font-bold text-text-light-secondary dark:text-dark-secondary">Status</th>
                <th className="p-4 text-sm font-bold text-text-light-secondary dark:text-dark-secondary text-right">Invoice</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-border-light dark:border-border-dark hover:bg-background-light dark:hover:bg-background-dark/50 transition-colors last:border-0"
                >
                  <td className="p-4 font-medium text-primary hover:underline cursor-pointer">{order.id}</td>
                  <td className="p-4 text-sm font-medium text-text-light-primary dark:text-dark-primary">{order.customer}</td>
                  <td className="p-4 text-sm text-text-light-secondary dark:text-dark-secondary">Oct 24, 2023</td>
                  <td className="p-4 text-sm font-bold text-text-light-primary dark:text-dark-primary">${order.amount.toFixed(2)}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button className="text-text-light-secondary hover:text-primary transition-colors" title="Download Invoice">
                      <span className="material-symbols-outlined text-[20px]">download</span>
                    </button>
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-text-light-secondary">
                    No orders found matching "{searchTerm}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { Order } from '../types';

interface RecentOrdersProps {
  orders: Order[];
}

export const RecentOrders: React.FC<RecentOrdersProps> = ({ orders }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'text-green-600 dark:text-green-400';
      case 'Pending':
        return 'text-orange-500 dark:text-orange-400';
      case 'Canceled':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-text-light-secondary';
    }
  };

  return (
    <div className="lg:col-span-1 flex flex-col gap-4 rounded-xl border border-border-light dark:border-border-dark p-6 bg-card-light dark:bg-card-dark shadow-sm">
      <div className="flex justify-between items-center">
        <h3 className="text-base font-medium text-text-light-primary dark:text-dark-primary">
          Recent Orders
        </h3>
        <a href="#" className="text-sm font-bold text-primary hover:underline">
          View All
        </a>
      </div>
      <div className="flex flex-col gap-4 overflow-y-auto max-h-[300px] lg:max-h-none pr-1 custom-scrollbar">
        {orders.length > 0 ? (
          orders.map((order) => (
            <div key={order.id} className="flex items-center gap-4 group cursor-pointer p-2 hover:bg-background-light dark:hover:bg-background-dark rounded-lg transition-colors">
              <div className="flex items-center justify-center size-10 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors shrink-0">
                <span className="material-symbols-outlined text-primary">shopping_bag</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-text-light-primary dark:text-dark-primary truncate">
                  Order {order.id}
                </p>
                <p className="text-xs text-text-light-secondary dark:text-dark-secondary truncate">
                  {order.customer}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-bold text-sm text-text-light-primary dark:text-dark-primary">
                  ${order.amount.toFixed(2)}
                </p>
                <p className={`text-xs ${getStatusColor(order.status)}`}>
                  {order.status}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-text-light-secondary">
            No orders found.
          </div>
        )}
      </div>
    </div>
  );
};
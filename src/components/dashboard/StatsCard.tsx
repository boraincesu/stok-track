'use client';

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  trendColor: string;
}

export function StatsCard({ title, value, change, trendColor }: StatsCardProps) {
  const emphasizeLowStock = title.toLowerCase().includes("low stock");

  return (
    <div className="flex flex-col gap-2 rounded-xl p-6 bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark shadow-sm">
      <p className="text-base font-medium text-text-light-secondary dark:text-dark-secondary">
        {title}
      </p>
      <p
        className={`text-3xl font-bold tracking-tight ${
          emphasizeLowStock ? "text-orange-500 dark:text-orange-400" : "text-text-light-primary dark:text-dark-primary"
        }`}
      >
        {value}
      </p>
      <p className={`text-sm font-medium ${trendColor}`}>{change}</p>
    </div>
  );
}

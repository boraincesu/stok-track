"use client";

import type { CSSProperties } from "react";

interface SkeletonProps {
  className?: string;
  style?: CSSProperties;
}

export function Skeleton({ className = "", style }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-md bg-gray-200 ${className}`}
      style={style}
    />
  );
}

export function StatsCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border-light bg-card-light p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="space-y-3 flex-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="h-12 w-12 rounded-xl" />
      </div>
    </div>
  );
}

// Fixed heights to prevent hydration mismatch (server/client values must match)
const CHART_BAR_HEIGHTS = [65, 80, 55, 90, 70, 85, 60];
const REPORT_BAR_HEIGHTS = [75, 85, 60, 95, 70, 80];

export function ChartSkeleton() {
  return (
    <div className="col-span-2 rounded-2xl border border-border-light bg-card-light p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-8 w-24 rounded-lg" />
      </div>
      <div className="h-[300px] flex items-end gap-2 pt-8">
        {CHART_BAR_HEIGHTS.map((height, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2">
            <Skeleton
              className="w-full rounded-t-md"
              style={{ height: `${height}%` }}
            />
            <Skeleton className="h-3 w-8" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function RecentOrdersSkeleton() {
  return (
    <div className="rounded-2xl border border-border-light bg-card-light p-6 shadow-sm">
      <Skeleton className="h-6 w-32 mb-4" />
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProductsTableSkeleton() {
  return (
    <div className="rounded-2xl border border-border-light bg-card-light shadow-sm overflow-hidden">
      <div className="p-6 border-b border-border-light">
        <Skeleton className="h-6 w-32" />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {[
                "Product",
                "Category",
                "Price",
                "Stock",
                "Status",
                "Actions",
              ].map((header) => (
                <th key={header} className="px-6 py-3 text-left">
                  <Skeleton className="h-4 w-16" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-light">
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-lg" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Skeleton className="h-6 w-20 rounded-full" />
                </td>
                <td className="px-6 py-4">
                  <Skeleton className="h-4 w-16" />
                </td>
                <td className="px-6 py-4">
                  <Skeleton className="h-4 w-12" />
                </td>
                <td className="px-6 py-4">
                  <Skeleton className="h-6 w-20 rounded-full" />
                </td>
                <td className="px-6 py-4">
                  <Skeleton className="h-8 w-8 rounded-lg" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function OrdersTableSkeleton() {
  return (
    <div className="rounded-2xl border border-border-light bg-card-light shadow-sm overflow-hidden">
      <div className="p-6 border-b border-border-light">
        <Skeleton className="h-6 w-32" />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {["Order ID", "Customer", "Date", "Amount", "Status"].map(
                (header) => (
                  <th key={header} className="px-6 py-3 text-left">
                    <Skeleton className="h-4 w-16" />
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-light">
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i}>
                <td className="px-6 py-4">
                  <Skeleton className="h-4 w-20" />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-4 w-28" />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Skeleton className="h-4 w-24" />
                </td>
                <td className="px-6 py-4">
                  <Skeleton className="h-4 w-16" />
                </td>
                <td className="px-6 py-4">
                  <Skeleton className="h-6 w-20 rounded-full" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function ReportsPageSkeleton() {
  return (
    <section className="flex flex-col gap-6">
      <header>
        <Skeleton className="h-6 w-48 mb-2" />
        <Skeleton className="h-4 w-64" />
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-border-light bg-card-light p-6 shadow-sm"
          >
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-8 w-32 mb-2" />
            <Skeleton className="h-3 w-28" />
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-[400px] rounded-2xl border border-border-light bg-card-light p-6 shadow-sm">
          <Skeleton className="h-6 w-32 mb-4" />
          <div className="h-[320px] flex items-end gap-2">
            {REPORT_BAR_HEIGHTS.map((height, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <Skeleton
                  className="w-full rounded-t-md"
                  style={{ height: `${height}%` }}
                />
                <Skeleton className="h-3 w-8" />
              </div>
            ))}
          </div>
        </div>
        <div className="h-[400px] rounded-2xl border border-border-light bg-card-light p-6 shadow-sm flex flex-col items-center justify-center">
          <Skeleton className="h-6 w-32 mb-4 self-start" />
          <Skeleton className="h-48 w-48 rounded-full" />
          <div className="flex gap-4 mt-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="h-3 w-3 rounded-full" />
                <Skeleton className="h-3 w-16" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function DashboardSkeleton() {
  return (
    <section className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatsCardSkeleton key={i} />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <ChartSkeleton />
        <RecentOrdersSkeleton />
      </div>
    </section>
  );
}

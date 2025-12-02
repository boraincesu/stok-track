"use client";

import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

import { SALES_DATA } from "@/data/dashboard";

export function SalesChart() {
  return (
    <div className="lg:col-span-2 flex flex-col gap-4 rounded-xl border border-border-light dark:border-border-dark p-6 bg-card-light dark:bg-card-dark shadow-sm h-full min-h-[400px]">
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="text-base font-medium text-text-light-primary dark:text-dark-primary">
            Sales Volume (Last 30 Days)
          </p>
          <p className="text-text-light-secondary dark:text-dark-secondary text-sm">
            Total sales from all channels
          </p>
        </div>
        <div className="flex items-center gap-1">
          <p className="text-sm font-medium text-green-600 dark:text-green-400">
            +12.5%
          </p>
        </div>
      </div>

      <div className="flex-1 w-full min-h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={SALES_DATA}
            margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
          >
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6c757d", fontSize: 12, fontWeight: 700 }}
              dy={10}
            />
            <Tooltip
              cursor={{ fill: "transparent" }}
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
              labelStyle={{ color: "#101922", fontWeight: "bold" }}
            />
            <Bar dataKey="sales" radius={[8, 8, 0, 0]} barSize={60}>
              {SALES_DATA.map((entry, index) => (
                <Cell
                  key={entry.name}
                  fill={index === 2 ? "#137fec" : "rgba(19, 127, 236, 0.2)"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

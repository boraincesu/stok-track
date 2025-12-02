import { Area, AreaChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { CATEGORY_DATA, REVENUE_DATA } from "@/data/dashboard";

const CATEGORY_COLORS = ["#137fec", "#10b981", "#f59e0b", "#ef4444"];

export function ReportsPage() {
  return (
    <section className="flex flex-col gap-6">
      <header>
        <h2 className="text-xl font-bold text-text-light-primary dark:text-dark-primary">Analytics & Reports</h2>
        <p className="text-sm text-text-light-secondary dark:text-dark-secondary">Get a quick pulse on revenue growth and category performance.</p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        {[{ label: "Total Revenue", value: "$124,500", delta: "+12.5% vs last year", positive: true },
          { label: "Avg. Order Value", value: "$145.20", delta: "+3.2% vs last month", positive: true },
          { label: "Conversion Rate", value: "3.6%", delta: "-0.4% vs last month", positive: false }].map((card) => (
          <article key={card.label} className="rounded-xl border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark p-6 shadow-sm">
            <p className="text-sm text-text-light-secondary dark:text-dark-secondary">{card.label}</p>
            <p className="text-2xl font-bold text-text-light-primary dark:text-dark-primary">{card.value}</p>
            <p className={`text-xs font-semibold ${card.positive ? "text-green-600" : "text-red-500"}`}>{card.delta}</p>
          </article>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <article className="flex h-[400px] flex-col rounded-2xl border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-text-light-primary dark:text-dark-primary">Revenue Trend</h3>
          <div className="mt-4 flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#137fec" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#137fec" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.6} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#6b7280", fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#6b7280", fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0" }} labelStyle={{ fontWeight: 600 }} />
                <Area type="monotone" dataKey="revenue" stroke="#137fec" strokeWidth={3} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </article>
        <article className="flex h-[400px] flex-col rounded-2xl border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-text-light-primary dark:text-dark-primary">Sales by Category</h3>
          <div className="mt-4 flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={CATEGORY_DATA} dataKey="value" innerRadius={80} outerRadius={120} paddingAngle={5}>
                  {CATEGORY_DATA.map((entry, index) => (
                    <Cell key={entry.name} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0" }} />
                <Legend verticalAlign="bottom" iconType="circle" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </article>
      </div>
    </section>
  );
}

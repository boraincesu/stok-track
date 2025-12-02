import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { REVENUE_DATA, CATEGORY_DATA } from '../constants';

const COLORS = ['#137fec', '#10b981', '#f59e0b', '#ef4444'];

export const ReportsPage: React.FC = () => {
  return (
    <div className="flex flex-col gap-6">
        <h2 className="text-xl font-bold text-text-light-primary dark:text-dark-primary">Analytics & Reports</h2>

        {/* Top KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl border border-border-light dark:border-border-dark">
                <p className="text-sm text-text-light-secondary">Total Revenue</p>
                <p className="text-2xl font-bold text-text-light-primary dark:text-dark-primary mt-1">$124,500.00</p>
                <p className="text-xs text-green-600 font-medium mt-1">+12.5% vs last year</p>
            </div>
             <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl border border-border-light dark:border-border-dark">
                <p className="text-sm text-text-light-secondary">Avg. Order Value</p>
                <p className="text-2xl font-bold text-text-light-primary dark:text-dark-primary mt-1">$145.20</p>
                <p className="text-xs text-green-600 font-medium mt-1">+3.2% vs last month</p>
            </div>
             <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl border border-border-light dark:border-border-dark">
                <p className="text-sm text-text-light-secondary">Conversion Rate</p>
                <p className="text-2xl font-bold text-text-light-primary dark:text-dark-primary mt-1">3.6%</p>
                <p className="text-xs text-red-600 font-medium mt-1">-0.4% vs last month</p>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Area Chart: Revenue */}
            <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl border border-border-light dark:border-border-dark h-[400px] flex flex-col">
                <h3 className="text-lg font-bold text-text-light-primary dark:text-dark-primary mb-4">Revenue Trend</h3>
                <div className="flex-1">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={REVENUE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#137fec" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#137fec" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" opacity={0.5} />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6c757d', fontSize: 12}} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#6c757d', fontSize: 12}} />
                            <Tooltip 
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            <Area type="monotone" dataKey="revenue" stroke="#137fec" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Pie Chart: Categories */}
            <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl border border-border-light dark:border-border-dark h-[400px] flex flex-col">
                 <h3 className="text-lg font-bold text-text-light-primary dark:text-dark-primary mb-4">Sales by Category</h3>
                 <div className="flex-1">
                     <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={CATEGORY_DATA}
                                cx="50%"
                                cy="50%"
                                innerRadius={80}
                                outerRadius={120}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {CATEGORY_DATA.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none' }} />
                            <Legend verticalAlign="bottom" height={36} iconType="circle"/>
                        </PieChart>
                     </ResponsiveContainer>
                 </div>
            </div>
        </div>
    </div>
  );
};
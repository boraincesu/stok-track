import React from 'react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', icon: 'dashboard', label: 'Dashboard' },
    { id: 'products', icon: 'inventory', label: 'Products' },
    { id: 'orders', icon: 'receipt_long', label: 'Orders' },
    { id: 'reports', icon: 'assessment', label: 'Reports' },
    { id: 'settings', icon: 'settings', label: 'Settings' },
  ];

  return (
    <aside className="flex w-64 flex-col bg-card-light dark:bg-card-dark p-4 border-r border-border-light dark:border-border-dark hidden md:flex sticky top-0 h-screen overflow-y-auto">
      <div className="flex items-center gap-3 px-2 mb-8">
        <span className="material-symbols-outlined text-primary text-3xl">inventory_2</span>
        <h1 className="text-xl font-bold text-text-light-primary dark:text-dark-primary">StockApp</h1>
      </div>

      <div className="flex flex-col gap-4 flex-1">
        <div className="flex flex-col gap-2">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
                  isActive
                    ? 'bg-primary/20 text-primary'
                    : 'hover:bg-primary/10 dark:hover:bg-primary/20 text-text-light-secondary dark:text-dark-secondary'
                }`}
              >
                <span className={`material-symbols-outlined ${!isActive && 'text-text-light-secondary dark:text-dark-secondary'}`}>
                  {item.icon}
                </span>
                <p className={`text-sm ${isActive ? 'font-bold' : 'font-medium'}`}>{item.label}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-3 p-2 rounded-lg mt-auto">
        <div
          className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
          style={{
            backgroundImage:
              'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDixNPxZBM9TSEvle9bG-MoRO5JB9PdhGZSMDWd6XVTFJ-Hu0ZagOYBHxi4FkIiTzdskVdn-NT_K4f1G48LIbuqs15zUkbFgj0sk7V1iub0Hv1SQpx94E32gtPaPF59yTZBoRdRHPhgYeDq6Te4P41Ekdm0V7vrtHAm8UR-zgpBnuJkPj8VB0cE73sy6zZ646vg8jDrV5tPnvlfuXLVYFLjEdFx70D-0Ubqoy0eqWFuzd1WPER0cKx-KHV7_kX-gFbaEexcIp0lluc")',
          }}
        ></div>
        <div className="flex flex-col overflow-hidden">
          <h1 className="text-text-light-primary dark:text-dark-primary text-sm font-medium leading-normal truncate">
            Olivia Rhye
          </h1>
          <p className="text-text-light-secondary dark:text-dark-secondary text-xs font-normal leading-normal truncate">
            olivia@example.com
          </p>
        </div>
        <button className="ml-auto p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
            <span className="material-symbols-outlined text-text-light-secondary dark:text-dark-secondary text-[20px]">logout</span>
        </button>
      </div>
    </aside>
  );
};
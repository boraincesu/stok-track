import React from 'react';

export const SettingsPage: React.FC = () => {
  return (
    <div className="max-w-4xl flex flex-col gap-8">
        <div>
             <h2 className="text-xl font-bold text-text-light-primary dark:text-dark-primary">Settings</h2>
             <p className="text-text-light-secondary text-sm">Manage your account settings and preferences.</p>
        </div>
      
      {/* Profile Section */}
      <div className="bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark p-6">
        <h3 className="text-lg font-bold text-text-light-primary dark:text-dark-primary mb-6">Profile Information</h3>
        <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="relative">
                 <div className="bg-center bg-no-repeat bg-cover rounded-full size-24" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDixNPxZBM9TSEvle9bG-MoRO5JB9PdhGZSMDWd6XVTFJ-Hu0ZagOYBHxi4FkIiTzdskVdn-NT_K4f1G48LIbuqs15zUkbFgj0sk7V1iub0Hv1SQpx94E32gtPaPF59yTZBoRdRHPhgYeDq6Te4P41Ekdm0V7vrtHAm8UR-zgpBnuJkPj8VB0cE73sy6zZ646vg8jDrV5tPnvlfuXLVYFLjEdFx70D-0Ubqoy0eqWFuzd1WPER0cKx-KHV7_kX-gFbaEexcIp0lluc")' }}></div>
                 <button className="absolute bottom-0 right-0 bg-primary text-white p-1.5 rounded-full shadow-lg hover:bg-primary/90 transition">
                     <span className="material-symbols-outlined text-[18px]">edit</span>
                 </button>
            </div>
            
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-text-light-primary dark:text-dark-primary">Full Name</label>
                    <input type="text" defaultValue="Olivia Rhye" className="rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark px-3 py-2 text-text-light-primary dark:text-dark-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
                </div>
                 <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-text-light-primary dark:text-dark-primary">Email Address</label>
                    <input type="email" defaultValue="olivia@example.com" className="rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark px-3 py-2 text-text-light-primary dark:text-dark-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
                </div>
                 <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-text-light-primary dark:text-dark-primary">Phone Number</label>
                    <input type="tel" defaultValue="+1 (555) 123-4567" className="rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark px-3 py-2 text-text-light-primary dark:text-dark-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
                </div>
                 <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-text-light-primary dark:text-dark-primary">Role</label>
                    <input type="text" defaultValue="Administrator" disabled className="rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark px-3 py-2 text-text-light-secondary dark:text-dark-secondary cursor-not-allowed" />
                </div>
                <div className="md:col-span-2 flex justify-end">
                    <button className="bg-primary text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-primary/90 transition-colors">Save Changes</button>
                </div>
            </div>
        </div>
      </div>

       {/* Notifications Section */}
      <div className="bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark p-6">
        <h3 className="text-lg font-bold text-text-light-primary dark:text-dark-primary mb-6">Notifications</h3>
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between py-2">
                <div>
                    <p className="font-medium text-text-light-primary dark:text-dark-primary">Order Alerts</p>
                    <p className="text-sm text-text-light-secondary">Receive notifications when a new order is placed.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
            </div>
             <div className="flex items-center justify-between py-2 border-t border-border-light dark:border-border-dark">
                <div>
                    <p className="font-medium text-text-light-primary dark:text-dark-primary">Low Stock Warnings</p>
                    <p className="text-sm text-text-light-secondary">Get notified when products fall below 10 units.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
            </div>
             <div className="flex items-center justify-between py-2 border-t border-border-light dark:border-border-dark">
                <div>
                    <p className="font-medium text-text-light-primary dark:text-dark-primary">Weekly Reports</p>
                    <p className="text-sm text-text-light-secondary">Receive a weekly summary of sales and inventory.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
            </div>
        </div>
      </div>
    </div>
  );
};
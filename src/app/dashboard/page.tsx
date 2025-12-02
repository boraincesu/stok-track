"use client";

import { useMemo, useState } from "react";

import { Header } from "@/components/dashboard/Header";
import { NewProductModal } from "@/components/dashboard/NewProductModal";
import { OrdersPage } from "@/components/dashboard/OrdersPage";
import { ProductsPage } from "@/components/dashboard/ProductsPage";
import { RecentOrders } from "@/components/dashboard/RecentOrders";
import { ReportsPage } from "@/components/dashboard/ReportsPage";
import { SalesChart } from "@/components/dashboard/SalesChart";
import { SettingsPage } from "@/components/dashboard/SettingsPage";
import { Sidebar, type SidebarTab } from "@/components/dashboard/Sidebar";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { ORDERS_DATA, PRODUCTS_DATA, RECENT_ORDERS, STATS } from "@/data/dashboard";
import type { Product } from "@/types/dashboard";

type TabId = SidebarTab;

const TAB_ITEMS: { id: TabId; label: string }[] = [
	{ id: "dashboard", label: "Dashboard" },
	{ id: "products", label: "Products" },
	{ id: "orders", label: "Orders" },
	{ id: "reports", label: "Reports" },
	{ id: "settings", label: "Settings" },
];

export default function DashboardPage() {
	const [activeTab, setActiveTab] = useState<TabId>("dashboard");
	const [searchTerm, setSearchTerm] = useState("");
	const [products, setProducts] = useState(PRODUCTS_DATA);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const handleAddProduct = () => {
		setActiveTab("products");
		setIsModalOpen(true);
	};

	const handleCreateProduct = (payload: { name: string; category: string; price: number; stock: number }) => {
		const deriveStatus = (stock: number): Product["status"] => {
			if (stock <= 0) return "Out of Stock";
			if (stock < 15) return "Low Stock";
			return "In Stock";
		};

		setProducts((previous) => [
			{
				id: `PRD-${Date.now()}`,
				name: payload.name,
				category: payload.category,
				price: payload.price,
				stock: payload.stock,
				status: deriveStatus(payload.stock),
			},
			...previous,
		]);
	};

	const dashboardContent = useMemo(
		() => (
			<section className="space-y-8">
				<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
					{STATS.map((stat) => (
						<StatsCard key={stat.title} {...stat} />
					))}
				</div>
				<div className="grid gap-6 lg:grid-cols-3">
					<SalesChart />
					<RecentOrders orders={RECENT_ORDERS} />
				</div>
			</section>
		),
		[]
	);


	const renderActiveContent = () => {
		switch (activeTab) {
			case "products":
				return <ProductsPage products={products} searchTerm={searchTerm} />;
			case "orders":
				return <OrdersPage orders={ORDERS_DATA} searchTerm={searchTerm} />;
			case "reports":
				return <ReportsPage />;
			case "settings":
				return <SettingsPage />;
			default:
				return dashboardContent;
		}
	};

	return (
		<div className="flex min-h-screen bg-background-light text-text-light-primary">
			<Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
			<div className="flex flex-1 flex-col">
				<nav className="sticky top-0 z-10 border-b border-border-light bg-card-light px-4 py-3 md:hidden">
					<div className="flex gap-2 overflow-x-auto">
						{TAB_ITEMS.map((tab) => {
							const isActive = tab.id === activeTab;
							return (
								<button
									key={tab.id}
									type="button"
									onClick={() => setActiveTab(tab.id)}
									className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${
										isActive ? "bg-primary text-white" : "bg-background-light text-text-light-secondary"
									}`}
								>
									{tab.label}
								</button>
							);
						})}
					</div>
				</nav>

				<main className="flex-1 px-4 py-8 md:px-10 lg:px-12">
					<Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} onAddProduct={handleAddProduct} />
					{renderActiveContent()}
				</main>
			</div>
			<NewProductModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleCreateProduct} />
		</div>
	);
}

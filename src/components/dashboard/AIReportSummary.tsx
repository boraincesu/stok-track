"use client";

import { useState } from "react";
import type { Product, Order } from "@/types/dashboard";

interface AIReportSummaryProps {
  products: Product[];
  orders: Order[];
}

export function AIReportSummary({ products, orders }: AIReportSummaryProps) {
  const [summary, setSummary] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  const generateSummary = async () => {
    setIsLoading(true);
    try {
      // Calculate stats
      const totalProducts = products.length;
      const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
      const lowStockCount = products.filter(
        (p) => p.status === "Low Stock"
      ).length;
      const outOfStockCount = products.filter(
        (p) => p.status === "Out of Stock"
      ).length;
      const totalStockValue = products.reduce(
        (sum, p) => sum + p.costPrice * p.stock,
        0
      );

      // Get top categories
      const categoryCount: Record<string, number> = {};
      products.forEach((p) => {
        categoryCount[p.category] = (categoryCount[p.category] || 0) + 1;
      });
      const topCategories = Object.entries(categoryCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([name]) => name);

      const res = await fetch("/api/ai/summarize-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          totalProducts,
          totalStock,
          lowStockCount,
          outOfStockCount,
          totalStockValue,
          topCategories,
        }),
      });

      const data = await res.json();
      if (data.summary) {
        setSummary(data.summary);
        setHasGenerated(true);
      }
    } catch (error) {
      console.error("AI summary error:", error);
      setSummary("Özet oluşturulurken bir hata oluştu.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <article className="rounded-2xl border border-border-light bg-gradient-to-br from-primary/5 to-primary/10 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
            <span className="material-symbols-outlined text-primary">
              auto_awesome
            </span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text-light-primary">
              AI Stok Analizi
            </h3>
            <p className="text-xs text-text-light-secondary">
              Yapay zeka destekli içgörüler
            </p>
          </div>
        </div>
        <button
          onClick={generateSummary}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">
            {isLoading ? "hourglass_empty" : hasGenerated ? "refresh" : "psychology"}
          </span>
          {isLoading ? "Analiz Ediliyor..." : hasGenerated ? "Yenile" : "Analiz Et"}
        </button>
      </div>

      {summary ? (
        <div className="bg-white/50 rounded-xl p-4 border border-primary/10">
          <p className="text-text-light-primary whitespace-pre-wrap leading-relaxed">
            {summary}
          </p>
        </div>
      ) : (
        <div className="bg-white/30 rounded-xl p-6 text-center border border-dashed border-primary/20">
          <span className="material-symbols-outlined text-4xl text-primary/40 mb-2">
            analytics
          </span>
          <p className="text-text-light-secondary text-sm">
            Stok verilerinizi analiz etmek için butona tıklayın
          </p>
        </div>
      )}
    </article>
  );
}

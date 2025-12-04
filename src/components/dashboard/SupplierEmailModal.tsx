"use client";

import { useState } from "react";
import type { Product } from "@/types/dashboard";

interface SupplierEmailModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export function SupplierEmailModal({
  product,
  isOpen,
  onClose,
}: SupplierEmailModalProps) {
  const [quantity, setQuantity] = useState<number>(50);
  const [email, setEmail] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/ai/generate-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: product.name,
          quantity,
          supplierName: product.supplier || undefined,
          currentStock: product.stock,
          unit: product.unit || "adet",
        }),
      });
      const data = await res.json();
      if (data.email) {
        setEmail(data.email);
      }
    } catch (error) {
      console.error("AI email error:", error);
      setEmail("E-posta oluşturulurken bir hata oluştu.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="flex w-full max-w-xl flex-col overflow-hidden rounded-xl bg-card-light border border-border-light shadow-2xl max-h-[90vh]">
        {/* Header */}
        <header className="flex items-center justify-between p-6 border-b border-border-light bg-gradient-to-r from-primary/5 to-primary/10">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">
                mail
              </span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-text-light-primary">
                Sipariş E-postası Oluştur
              </h2>
              <p className="text-sm text-text-light-secondary">
                {product.name}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-text-light-secondary hover:bg-gray-100"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </header>

        {/* Content */}
        <div className="p-6 space-y-4 overflow-y-auto">
          {/* Product Info */}
          <div className="bg-background-light rounded-lg p-4 flex items-center gap-4">
            <div className="flex-1">
              <p className="text-sm text-text-light-secondary">Mevcut Stok</p>
              <p className="text-xl font-bold text-text-light-primary">
                {product.stock} {product.unit || "adet"}
              </p>
            </div>
            <div className="flex-1">
              <p className="text-sm text-text-light-secondary">Tedarikçi</p>
              <p className="font-medium text-text-light-primary">
                {product.supplier || "Belirtilmemiş"}
              </p>
            </div>
          </div>

          {/* Quantity Input */}
          <div>
            <label className="block text-sm font-medium text-text-light-secondary mb-2">
              Sipariş Miktarı ({product.unit || "adet"})
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              min="1"
              className="w-full px-4 py-2.5 border border-border-light rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            />
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">
              {isGenerating ? "hourglass_empty" : "auto_awesome"}
            </span>
            {isGenerating ? "E-posta Oluşturuluyor..." : "AI ile E-posta Oluştur"}
          </button>

          {/* Generated Email */}
          {email && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-text-light-secondary">
                  Oluşturulan E-posta
                </p>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {copied ? "check" : "content_copy"}
                  </span>
                  {copied ? "Kopyalandı!" : "Kopyala"}
                </button>
              </div>
              <div className="bg-white border border-border-light rounded-lg p-4 max-h-[300px] overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm text-text-light-primary font-sans leading-relaxed">
                  {email}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="flex gap-3 p-6 border-t border-border-light bg-background-light">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg border border-border-light px-4 py-2.5 text-sm font-semibold text-text-light-secondary hover:bg-gray-100"
          >
            Kapat
          </button>
          {email && (
            <button
              onClick={handleCopy}
              className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">
                content_copy
              </span>
              Panoya Kopyala
            </button>
          )}
        </footer>
      </div>
    </div>
  );
}

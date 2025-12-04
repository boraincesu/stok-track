"use client";

import { useState, type ChangeEvent } from "react";
import type { Product } from "@/types/dashboard";

interface ProductDetailModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: (productId: string, updates: Partial<Product>) => void;
}

const STATUS_STYLES: Record<Product["status"], string> = {
  "In Stock": "bg-green-100 text-green-700",
  "Low Stock": "bg-orange-100 text-orange-700",
  "Out of Stock": "bg-red-100 text-red-700",
};

export function ProductDetailModal({
  product,
  isOpen,
  onClose,
  onUpdate,
}: ProductDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Product>>({});

  if (!isOpen) return null;

  const handleStartEdit = () => {
    setIsEditing(true);
    setEditForm({
      name: product.name,
      sku: product.sku,
      barcode: product.barcode,
      price: product.price,
      costPrice: product.costPrice,
      stock: product.stock,
      minStock: product.minStock,
      unit: product.unit,
      supplier: product.supplier,
      description: product.description,
      location: product.location,
    });
  };

  const handleSaveEdit = () => {
    if (onUpdate) {
      onUpdate(product.id, editForm);
    }
    setIsEditing(false);
    setEditForm({});
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditForm({});
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    let processedValue: string | number = value;
    
    if (name === "name") {
      processedValue = value.toUpperCase();
    } else if (type === "number") {
      processedValue = Number(value);
    }
    
    setEditForm((prev) => ({ ...prev, [name]: processedValue }));
  };

  const profitMargin = product.costPrice > 0
    ? ((product.price - product.costPrice) / product.costPrice) * 100
    : 0;

  const inputClass =
    "w-full px-3 py-2 border border-border-light rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-background-light";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="flex w-full max-w-2xl flex-col overflow-hidden rounded-xl bg-card-light border border-border-light shadow-2xl max-h-[90vh]">
        {/* Header */}
        <header className="flex items-center justify-between p-6 border-b border-border-light bg-background-light">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-2xl">
                inventory_2
              </span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-text-light-primary">
                {product.name}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    STATUS_STYLES[product.status]
                  }`}
                >
                  {product.status}
                </span>
                <span className="text-sm text-text-light-secondary">
                  {product.category}
                </span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-text-light-secondary hover:bg-gray-100"
            aria-label="Close modal"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </header>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Identifiers */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="bg-background-light rounded-lg p-4">
              <p className="text-xs font-medium text-text-light-secondary uppercase tracking-wider mb-1">
                SKU / Ürün Kodu
              </p>
              {isEditing ? (
                <input
                  name="sku"
                  value={editForm.sku || ""}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="SKU-001"
                />
              ) : (
                <p className="text-text-light-primary font-medium">
                  {product.sku || "—"}
                </p>
              )}
            </div>
            <div className="bg-background-light rounded-lg p-4">
              <p className="text-xs font-medium text-text-light-secondary uppercase tracking-wider mb-1">
                Barkod
              </p>
              {isEditing ? (
                <input
                  name="barcode"
                  value={editForm.barcode || ""}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="8690123456789"
                />
              ) : (
                <p className="text-text-light-primary font-medium font-mono">
                  {product.barcode || "—"}
                </p>
              )}
            </div>
          </div>

          {/* Pricing */}
          <div>
            <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-3">
              Fiyatlandırma
            </h3>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="bg-background-light rounded-lg p-4">
                <p className="text-xs font-medium text-text-light-secondary uppercase tracking-wider mb-1">
                  Satış Fiyatı
                </p>
                {isEditing ? (
                  <input
                    type="number"
                    name="price"
                    value={editForm.price || 0}
                    onChange={handleChange}
                    className={inputClass}
                    step="0.01"
                    min="0"
                  />
                ) : (
                  <p className="text-xl font-bold text-text-light-primary">
                    ${product.price.toFixed(2)}
                  </p>
                )}
              </div>
              <div className="bg-background-light rounded-lg p-4">
                <p className="text-xs font-medium text-text-light-secondary uppercase tracking-wider mb-1">
                  Alış Fiyatı
                </p>
                {isEditing ? (
                  <input
                    type="number"
                    name="costPrice"
                    value={editForm.costPrice || 0}
                    onChange={handleChange}
                    className={inputClass}
                    step="0.01"
                    min="0"
                  />
                ) : (
                  <p className="text-xl font-bold text-text-light-primary">
                    ${product.costPrice.toFixed(2)}
                  </p>
                )}
              </div>
              <div className="bg-background-light rounded-lg p-4">
                <p className="text-xs font-medium text-text-light-secondary uppercase tracking-wider mb-1">
                  Kar Marjı
                </p>
                <p className={`text-xl font-bold ${profitMargin > 0 ? "text-green-600" : "text-red-600"}`}>
                  {profitMargin > 0 ? "+" : ""}{profitMargin.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>

          {/* Stock */}
          <div>
            <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-3">
              Stok Bilgileri
            </h3>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="bg-background-light rounded-lg p-4">
                <p className="text-xs font-medium text-text-light-secondary uppercase tracking-wider mb-1">
                  Mevcut Stok
                </p>
                {isEditing ? (
                  <input
                    type="number"
                    name="stock"
                    value={editForm.stock || 0}
                    onChange={handleChange}
                    className={inputClass}
                    min="0"
                  />
                ) : (
                  <p className="text-xl font-bold text-text-light-primary">
                    {product.stock} <span className="text-sm font-normal text-text-light-secondary">{product.unit || "adet"}</span>
                  </p>
                )}
              </div>
              <div className="bg-background-light rounded-lg p-4">
                <p className="text-xs font-medium text-text-light-secondary uppercase tracking-wider mb-1">
                  Minimum Stok
                </p>
                {isEditing ? (
                  <input
                    type="number"
                    name="minStock"
                    value={editForm.minStock || 0}
                    onChange={handleChange}
                    className={inputClass}
                    min="0"
                  />
                ) : (
                  <p className="text-xl font-bold text-text-light-primary">
                    {product.minStock || 0}
                  </p>
                )}
              </div>
              <div className="bg-background-light rounded-lg p-4">
                <p className="text-xs font-medium text-text-light-secondary uppercase tracking-wider mb-1">
                  Raf / Konum
                </p>
                {isEditing ? (
                  <input
                    name="location"
                    value={editForm.location || ""}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="A-1-3"
                  />
                ) : (
                  <p className="text-text-light-primary font-medium">
                    {product.location || "—"}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Supplier & Description */}
          <div>
            <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-3">
              Ek Bilgiler
            </h3>
            <div className="space-y-4">
              <div className="bg-background-light rounded-lg p-4">
                <p className="text-xs font-medium text-text-light-secondary uppercase tracking-wider mb-1">
                  Tedarikçi
                </p>
                {isEditing ? (
                  <input
                    name="supplier"
                    value={editForm.supplier || ""}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Tedarikçi firma adı"
                  />
                ) : (
                  <p className="text-text-light-primary font-medium">
                    {product.supplier || "—"}
                  </p>
                )}
              </div>
              <div className="bg-background-light rounded-lg p-4">
                <p className="text-xs font-medium text-text-light-secondary uppercase tracking-wider mb-1">
                  Açıklama
                </p>
                {isEditing ? (
                  <textarea
                    name="description"
                    value={editForm.description || ""}
                    onChange={handleChange}
                    className={`${inputClass} resize-none`}
                    rows={3}
                    placeholder="Ürün açıklaması..."
                  />
                ) : (
                  <p className="text-text-light-primary whitespace-pre-wrap">
                    {product.description || "—"}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="flex gap-3 p-6 border-t border-border-light bg-background-light">
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="flex-1 rounded-lg border border-border-light px-4 py-2.5 text-sm font-semibold text-text-light-secondary hover:bg-gray-100"
              >
                İptal
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary/90"
              >
                Kaydet
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-lg border border-border-light px-4 py-2.5 text-sm font-semibold text-text-light-secondary hover:bg-gray-100"
              >
                Kapat
              </button>
              {onUpdate && (
                <button
                  type="button"
                  onClick={handleStartEdit}
                  className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">edit</span>
                  Düzenle
                </button>
              )}
            </>
          )}
        </footer>
      </div>
    </div>
  );
}

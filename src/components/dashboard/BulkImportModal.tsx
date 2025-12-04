"use client";

import { useState, useRef, type ChangeEvent } from "react";
import Swal from "sweetalert2";

interface BulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface ParsedProduct {
  name: string;
  sku?: string;
  barcode?: string;
  category: string;
  price: number;
  costPrice: number;
  stock: number;
  minStock?: number;
  unit?: string;
  supplier?: string;
  description?: string;
  location?: string;
}

const SAMPLE_CSV = `name,category,costPrice,price,stock,minStock,unit,sku,barcode,supplier,location,description
LAPTOP HP PROBOOK,Electronics,800,1200,50,10,adet,HP-001,8690001234567,HP Türkiye,A-1-1,Ofis bilgisayarları için
MOUSE LOGITECH,Electronics,15,25,100,20,adet,LOG-001,,Logitech,A-1-2,
KLAVYE MEKANIK,Electronics,45,75,30,5,adet,KB-001,,,A-1-3,Yazılım ekibi için`;

export function BulkImportModal({
  isOpen,
  onClose,
  onSuccess,
}: BulkImportModalProps) {
  const [parsedProducts, setParsedProducts] = useState<ParsedProduct[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const parseCSV = (text: string): ParsedProduct[] => {
    const lines = text.trim().split("\n");
    if (lines.length < 2) return [];

    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
    const products: ParsedProduct[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map((v) => v.trim());
      const product: Record<string, string | number> = {};

      headers.forEach((header, index) => {
        product[header] = values[index] || "";
      });

      // Map to our product structure
      products.push({
        name: String(product.name || ""),
        sku: product.sku ? String(product.sku) : undefined,
        barcode: product.barcode ? String(product.barcode) : undefined,
        category: String(product.category || "Genel"),
        price: Number(product.price) || 0,
        costPrice: Number(product.costprice || product.costPrice) || 0,
        stock: Number(product.stock) || 0,
        minStock: Number(product.minstock || product.minStock) || 0,
        unit: String(product.unit || "adet"),
        supplier: product.supplier ? String(product.supplier) : undefined,
        description: product.description ? String(product.description) : undefined,
        location: product.location ? String(product.location) : undefined,
      });
    }

    return products.filter((p) => p.name.trim() !== "");
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const products = parseCSV(text);
      setParsedProducts(products);
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (parsedProducts.length === 0) return;

    setIsUploading(true);
    try {
      const res = await fetch("/api/products/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products: parsedProducts }),
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire({
          title: "Başarılı!",
          text: data.message || `${data.count} ürün eklendi`,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        onSuccess();
        handleClose();
      } else {
        Swal.fire({
          title: "Hata!",
          text: data.error || "İçe aktarma başarısız",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Import error:", error);
      Swal.fire({
        title: "Hata!",
        text: "Sunucuya bağlanılamadı",
        icon: "error",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setParsedProducts([]);
    setFileName("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    onClose();
  };

  const downloadSample = () => {
    const blob = new Blob([SAMPLE_CSV], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ornek_urunler.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="flex w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-card-light border border-border-light shadow-2xl max-h-[90vh]">
        {/* Header */}
        <header className="flex items-center justify-between p-6 border-b border-border-light">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">
                upload_file
              </span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-text-light-primary">
                Toplu Ürün İçe Aktar
              </h2>
              <p className="text-sm text-text-light-secondary">
                CSV dosyasından ürünleri içe aktarın
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-full p-2 text-text-light-secondary hover:bg-gray-100"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </header>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-blue-600">info</span>
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">CSV Dosya Formatı</p>
                <p>İlk satır başlık olmalı. Zorunlu sütunlar: <strong>name, category, costPrice, stock</strong></p>
                <button
                  onClick={downloadSample}
                  className="mt-2 text-blue-600 hover:text-blue-800 underline font-medium"
                >
                  Örnek CSV dosyasını indir
                </button>
              </div>
            </div>
          </div>

          {/* File Upload */}
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
              id="csv-upload"
            />
            <label
              htmlFor="csv-upload"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border-light rounded-xl cursor-pointer hover:bg-background-light transition-colors"
            >
              <span className="material-symbols-outlined text-3xl text-text-light-secondary mb-2">
                cloud_upload
              </span>
              {fileName ? (
                <p className="text-sm text-text-light-primary font-medium">{fileName}</p>
              ) : (
                <p className="text-sm text-text-light-secondary">
                  CSV dosyasını sürükleyin veya tıklayın
                </p>
              )}
            </label>
          </div>

          {/* Preview Table */}
          {parsedProducts.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-text-light-primary">
                  Önizleme ({parsedProducts.length} ürün)
                </h3>
                <span className="text-xs text-text-light-secondary">
                  İlk 10 ürün gösteriliyor
                </span>
              </div>
              <div className="border border-border-light rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-background-light">
                    <tr>
                      <th className="px-3 py-2 text-left font-medium text-text-light-secondary">Ürün Adı</th>
                      <th className="px-3 py-2 text-left font-medium text-text-light-secondary">Kategori</th>
                      <th className="px-3 py-2 text-right font-medium text-text-light-secondary">Alış</th>
                      <th className="px-3 py-2 text-right font-medium text-text-light-secondary">Stok</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsedProducts.slice(0, 10).map((product, index) => (
                      <tr key={index} className="border-t border-border-light">
                        <td className="px-3 py-2 font-medium text-text-light-primary">{product.name}</td>
                        <td className="px-3 py-2 text-text-light-secondary">{product.category}</td>
                        <td className="px-3 py-2 text-right text-text-light-primary">${product.costPrice}</td>
                        <td className="px-3 py-2 text-right text-text-light-primary">{product.stock}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="flex gap-3 p-6 border-t border-border-light bg-background-light">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 rounded-lg border border-border-light px-4 py-2.5 text-sm font-semibold text-text-light-secondary hover:bg-gray-100"
          >
            İptal
          </button>
          <button
            onClick={handleImport}
            disabled={parsedProducts.length === 0 || isUploading}
            className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isUploading ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                İçe Aktarılıyor...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">upload</span>
                {parsedProducts.length} Ürün İçe Aktar
              </>
            )}
          </button>
        </footer>
      </div>
    </div>
  );
}

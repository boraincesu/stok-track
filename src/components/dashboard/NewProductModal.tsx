import { useState, type ChangeEvent, type FormEvent } from "react";

interface NewProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: {
    name: string;
    sku?: string;
    barcode?: string;
    category: string;
    price: number;
    costPrice: number;
    stock: number;
    minStock: number;
    unit: string;
    supplier?: string;
    description?: string;
    location?: string;
  }) => void;
}

const CATEGORY_OPTIONS = ["Electronics", "Clothing", "Home", "Toys", "Books"];

const UNIT_OPTIONS = [
  { value: "adet", label: "Adet" },
  { value: "kg", label: "Kilogram (kg)" },
  { value: "gr", label: "Gram (gr)" },
  { value: "lt", label: "Litre (lt)" },
  { value: "ml", label: "Mililitre (ml)" },
  { value: "m", label: "Metre (m)" },
  { value: "cm", label: "Santimetre (cm)" },
  { value: "m2", label: "Metrekare (m²)" },
  { value: "paket", label: "Paket" },
  { value: "kutu", label: "Kutu" },
];

export function NewProductModal({
  isOpen,
  onClose,
  onSubmit,
}: NewProductModalProps) {
  const [formState, setFormState] = useState({
    name: "",
    sku: "",
    barcode: "",
    category: "",
    price: "",
    costPrice: "",
    stock: "",
    minStock: "",
    unit: "adet",
    supplier: "",
    description: "",
    location: "",
  });
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit({
      name: formState.name,
      sku: formState.sku || undefined,
      barcode: formState.barcode || undefined,
      category: formState.category,
      price: Number(formState.price),
      costPrice: Number(formState.costPrice),
      stock: Number(formState.stock),
      minStock: Number(formState.minStock) || 0,
      unit: formState.unit,
      supplier: formState.supplier || undefined,
      description: formState.description || undefined,
      location: formState.location || undefined,
    });
    setFormState({
      name: "",
      sku: "",
      barcode: "",
      category: "",
      price: "",
      costPrice: "",
      stock: "",
      minStock: "",
      unit: "adet",
      supplier: "",
      description: "",
      location: "",
    });
    onClose();
  };

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    // Convert product name to uppercase
    const processedValue = name === "name" ? value.toUpperCase() : value;
    setFormState((prev) => ({ ...prev, [name]: processedValue }));
  };

  const inputClass =
    "rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark px-3 py-2.5 text-text-light-primary dark:text-dark-primary placeholder:text-text-light-secondary focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm";

  const labelClass =
    "flex flex-col gap-1.5 text-sm font-semibold text-text-light-primary dark:text-dark-primary";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="flex w-full max-w-2xl flex-col overflow-hidden rounded-xl bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark shadow-2xl max-h-[90vh]">
        <header className="flex items-center justify-between p-6 border-b border-border-light dark:border-border-dark">
          <div>
            <p className="text-sm font-semibold text-text-light-secondary dark:text-dark-secondary uppercase tracking-[0.2em]">
              Envanter
            </p>
            <h2 className="text-xl font-bold text-text-light-primary dark:text-dark-primary">
              Yeni Ürün Ekle
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-text-light-secondary hover:bg-background-light dark:hover:bg-background-dark"
            aria-label="Close modal"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </header>
        
        <form className="p-6 flex flex-col gap-4 overflow-y-auto" onSubmit={handleSubmit}>
          {/* Temel Bilgiler */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-primary uppercase tracking-wider">Temel Bilgiler</h3>
            
            <label className={labelClass}>
              Ürün Adı *
              <input
                className={inputClass}
                name="name"
                placeholder="ÜRÜN ADI"
                required
                value={formState.name}
                onChange={handleChange}
                type="text"
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className={labelClass}>
                SKU / Ürün Kodu
                <input
                  className={inputClass}
                  name="sku"
                  placeholder="SKU-001"
                  value={formState.sku}
                  onChange={handleChange}
                  type="text"
                />
              </label>
              <label className={labelClass}>
                Barkod
                <input
                  className={inputClass}
                  name="barcode"
                  placeholder="8690123456789"
                  value={formState.barcode}
                  onChange={handleChange}
                  type="text"
                />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className={labelClass}>
                Kategori *
                <select
                  className={inputClass}
                  name="category"
                  required
                  value={formState.category}
                  onChange={handleChange}
                >
                  <option value="" disabled>
                    Kategori seçin
                  </option>
                  {CATEGORY_OPTIONS.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>
              <label className={labelClass}>
                Birim *
                <select
                  className={inputClass}
                  name="unit"
                  required
                  value={formState.unit}
                  onChange={handleChange}
                >
                  {UNIT_OPTIONS.map((unit) => (
                    <option key={unit.value} value={unit.value}>
                      {unit.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          {/* Fiyatlandırma */}
          <div className="space-y-4 pt-2">
            <h3 className="text-sm font-bold text-primary uppercase tracking-wider">Fiyatlandırma</h3>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <label className={labelClass}>
                Satış Fiyatı ($)
                <input
                  className={inputClass}
                  inputMode="decimal"
                  min="0"
                  name="price"
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  type="number"
                  value={formState.price}
                />
              </label>
              <label className={labelClass}>
                Alış Fiyatı ($) *
                <input
                  className={inputClass}
                  inputMode="decimal"
                  min="0"
                  name="costPrice"
                  onChange={handleChange}
                  placeholder="0.00"
                  required
                  step="0.01"
                  type="number"
                  value={formState.costPrice}
                />
              </label>
            </div>
          </div>

          {/* Stok Bilgileri */}
          <div className="space-y-4 pt-2">
            <h3 className="text-sm font-bold text-primary uppercase tracking-wider">Stok Bilgileri</h3>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <label className={labelClass}>
                Başlangıç Stoku *
                <input
                  className={inputClass}
                  min="0"
                  name="stock"
                  onChange={handleChange}
                  placeholder="0"
                  required
                  type="number"
                  value={formState.stock}
                />
              </label>
              <label className={labelClass}>
                Minimum Stok Seviyesi
                <input
                  className={inputClass}
                  min="0"
                  name="minStock"
                  onChange={handleChange}
                  placeholder="0"
                  type="number"
                  value={formState.minStock}
                />
              </label>
            </div>

            <label className={labelClass}>
              Raf / Konum
              <input
                className={inputClass}
                name="location"
                placeholder="A-1-3 veya Depo 1"
                value={formState.location}
                onChange={handleChange}
                type="text"
              />
            </label>
          </div>

          {/* Ek Bilgiler */}
          <div className="space-y-4 pt-2">
            <h3 className="text-sm font-bold text-primary uppercase tracking-wider">Ek Bilgiler</h3>
            
            <label className={labelClass}>
              Tedarikçi
              <input
                className={inputClass}
                name="supplier"
                placeholder="Tedarikçi firma adı"
                value={formState.supplier}
                onChange={handleChange}
                type="text"
              />
            </label>

            <div className="flex flex-col gap-1.5">
              <span className="text-sm font-semibold text-text-light-primary dark:text-dark-primary">Açıklama</span>
              <textarea
                className={`${inputClass} resize-none`}
                name="description"
                placeholder="Ürün hakkında ek notlar..."
                value={formState.description}
                onChange={handleChange}
                rows={3}
              />
              <button
                type="button"
                onClick={async () => {
                  if (!formState.name) {
                    alert("Önce ürün adını girin");
                    return;
                  }
                  setIsGeneratingDescription(true);
                  try {
                    const res = await fetch("/api/ai/generate-description", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        name: formState.name,
                        category: formState.category || "Genel",
                      }),
                    });
                    const data = await res.json();
                    if (data.description) {
                      setFormState((prev) => ({ ...prev, description: data.description }));
                    }
                  } catch (error) {
                    console.error("AI error:", error);
                  } finally {
                    setIsGeneratingDescription(false);
                  }
                }}
                disabled={isGeneratingDescription || !formState.name}
                className="self-start flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {isGeneratingDescription ? "hourglass_empty" : "auto_awesome"}
                </span>
                {isGeneratingDescription ? "Oluşturuluyor..." : "AI ile Oluştur"}
              </button>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-border-light dark:border-border-dark mt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-border-light dark:border-border-dark px-4 py-2.5 text-sm font-semibold text-text-light-secondary hover:bg-background-light dark:text-dark-secondary dark:hover:bg-background-dark"
            >
              İptal
            </button>
            <button
              type="submit"
              className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary/90"
            >
              Ürün Ekle
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

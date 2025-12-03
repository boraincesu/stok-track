import { useState, type ChangeEvent, type FormEvent } from "react";

interface NewProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: {
    name: string;
    category: string;
    price: number;
    costPrice: number;
    stock: number;
  }) => void;
}

const CATEGORY_OPTIONS = ["Electronics", "Clothing", "Home", "Toys", "Books"];

export function NewProductModal({
  isOpen,
  onClose,
  onSubmit,
}: NewProductModalProps) {
  const [formState, setFormState] = useState({
    name: "",
    category: "",
    price: "",
    costPrice: "",
    stock: "",
  });

  if (!isOpen) return null;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit({
      name: formState.name,
      category: formState.category,
      price: Number(formState.price),
      costPrice: Number(formState.costPrice),
      stock: Number(formState.stock),
    });
    setFormState({
      name: "",
      category: "",
      price: "",
      costPrice: "",
      stock: "",
    });
    onClose();
  };

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="flex w-full max-w-md flex-col overflow-hidden rounded-xl bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark shadow-2xl">
        <header className="flex items-center justify-between p-6 border-b border-border-light dark:border-border-dark">
          <div>
            <p className="text-sm font-semibold text-text-light-secondary dark:text-dark-secondary uppercase tracking-[0.2em]">
              Inventory
            </p>
            <h2 className="text-xl font-bold text-text-light-primary dark:text-dark-primary">
              Add New Product
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
        <form className="p-6 flex flex-col gap-4" onSubmit={handleSubmit}>
          <label className="flex flex-col gap-1.5 text-sm font-semibold text-text-light-primary dark:text-dark-primary">
            Product Name
            <input
              className="rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark px-3 py-2.5 text-text-light-primary dark:text-dark-primary placeholder:text-text-light-secondary focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              name="name"
              placeholder="Wireless Headphones"
              required
              value={formState.name}
              onChange={handleChange}
              type="text"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-semibold text-text-light-primary dark:text-dark-primary">
            Category
            <select
              className="rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark px-3 py-2.5 text-text-light-primary dark:text-dark-primary focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              name="category"
              required
              value={formState.category}
              onChange={handleChange}
            >
              <option value="" disabled>
                Select category
              </option>
              {CATEGORY_OPTIONS.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5 text-sm font-semibold text-text-light-primary dark:text-dark-primary">
              Selling Price ($)
              <input
                className="rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark px-3 py-2.5 text-text-light-primary dark:text-dark-primary focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                inputMode="decimal"
                min="0"
                name="price"
                onChange={handleChange}
                placeholder="0.00"
                required
                step="0.01"
                type="number"
                value={formState.price}
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm font-semibold text-text-light-primary dark:text-dark-primary">
              Cost Price ($)
              <input
                className="rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark px-3 py-2.5 text-text-light-primary dark:text-dark-primary focus:border-primary focus:ring-1 focus:ring-primary outline-none"
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
          <label className="flex flex-col gap-1.5 text-sm font-semibold text-text-light-primary dark:text-dark-primary">
            Initial Stock
            <input
              className="rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark px-3 py-2.5 text-text-light-primary dark:text-dark-primary focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              min="0"
              name="stock"
              onChange={handleChange}
              placeholder="0"
              required
              type="number"
              value={formState.stock}
            />
          </label>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-border-light dark:border-border-dark px-4 py-2.5 text-sm font-semibold text-text-light-secondary hover:bg-background-light dark:text-dark-secondary dark:hover:bg-background-dark"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary/90"
            >
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

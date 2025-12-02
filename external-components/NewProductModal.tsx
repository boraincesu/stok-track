import React, { useState } from 'react';

interface NewProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (product: { name: string; category: string; price: string; quantity: string }) => void;
}

export const NewProductModal: React.FC<NewProductModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    quantity: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ name: '', category: '', price: '', quantity: '' }); // Reset form
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-2xl w-full max-w-md border border-border-light dark:border-border-dark flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-border-light dark:border-border-dark">
          <h2 className="text-xl font-bold text-text-light-primary dark:text-dark-primary">Add New Product</h2>
          <button 
            onClick={onClose}
            className="text-text-light-secondary hover:text-text-light-primary dark:hover:text-dark-primary transition-colors p-1 rounded-md hover:bg-background-light dark:hover:bg-background-dark"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5 overflow-y-auto">
          
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="text-sm font-semibold text-text-light-primary dark:text-dark-primary">
              Product Name
            </label>
            <input
              required
              id="name"
              name="name"
              type="text"
              placeholder="e.g. Wireless Headphones"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark px-3 py-2.5 text-text-light-primary dark:text-dark-primary placeholder:text-text-light-secondary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="category" className="text-sm font-semibold text-text-light-primary dark:text-dark-primary">
              Category
            </label>
            <select
              required
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark px-3 py-2.5 text-text-light-primary dark:text-dark-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
            >
              <option value="" disabled>Select a category</option>
              <option value="Electronics">Electronics</option>
              <option value="Clothing">Clothing</option>
              <option value="Home">Home & Garden</option>
              <option value="Toys">Toys & Games</option>
              <option value="Books">Books</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="price" className="text-sm font-semibold text-text-light-primary dark:text-dark-primary">
                Price ($)
              </label>
              <input
                required
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={formData.price}
                onChange={handleChange}
                className="w-full rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark px-3 py-2.5 text-text-light-primary dark:text-dark-primary placeholder:text-text-light-secondary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="quantity" className="text-sm font-semibold text-text-light-primary dark:text-dark-primary">
                Initial Stock
              </label>
              <input
                required
                id="quantity"
                name="quantity"
                type="number"
                min="0"
                placeholder="0"
                value={formData.quantity}
                onChange={handleChange}
                className="w-full rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark px-3 py-2.5 text-text-light-primary dark:text-dark-primary placeholder:text-text-light-secondary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
              />
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-border-light dark:border-border-dark bg-transparent px-4 py-2.5 text-sm font-bold text-text-light-secondary hover:bg-background-light dark:hover:bg-background-dark transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-primary/90 transition-colors"
            >
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
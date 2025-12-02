import React from 'react';
import { PRODUCTS_DATA, Product } from '../constants';

interface ProductsPageProps {
  searchTerm: string;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({ searchTerm }) => {
  const filteredProducts = PRODUCTS_DATA.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: Product['status']) => {
    switch (status) {
      case 'In Stock': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'Low Stock': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
      case 'Out of Stock': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-text-light-primary dark:text-dark-primary">Product Inventory</h2>
        <div className="flex gap-2">
            <button className="px-4 py-2 text-sm font-medium text-text-light-secondary border border-border-light dark:border-border-dark rounded-lg hover:bg-background-light dark:hover:bg-card-dark transition-colors">
                Export
            </button>
             <button className="px-4 py-2 text-sm font-medium text-text-light-secondary border border-border-light dark:border-border-dark rounded-lg hover:bg-background-light dark:hover:bg-card-dark transition-colors">
                Filters
            </button>
        </div>
      </div>

      <div className="bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-background-light dark:bg-background-dark border-b border-border-light dark:border-border-dark">
                <th className="p-4 text-sm font-bold text-text-light-secondary dark:text-dark-secondary">Product Name</th>
                <th className="p-4 text-sm font-bold text-text-light-secondary dark:text-dark-secondary">Category</th>
                <th className="p-4 text-sm font-bold text-text-light-secondary dark:text-dark-secondary">Price</th>
                <th className="p-4 text-sm font-bold text-text-light-secondary dark:text-dark-secondary">Stock</th>
                <th className="p-4 text-sm font-bold text-text-light-secondary dark:text-dark-secondary">Status</th>
                <th className="p-4 text-sm font-bold text-text-light-secondary dark:text-dark-secondary text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="border-b border-border-light dark:border-border-dark hover:bg-background-light dark:hover:bg-background-dark/50 transition-colors last:border-0">
                  <td className="p-4">
                    <p className="font-medium text-text-light-primary dark:text-dark-primary">{product.name}</p>
                    <p className="text-xs text-text-light-secondary dark:text-dark-secondary md:hidden">{product.category}</p>
                  </td>
                  <td className="p-4 text-sm text-text-light-secondary dark:text-dark-secondary hidden md:table-cell">{product.category}</td>
                  <td className="p-4 text-sm font-medium text-text-light-primary dark:text-dark-primary">${product.price.toFixed(2)}</td>
                  <td className="p-4 text-sm text-text-light-secondary dark:text-dark-secondary">{product.stock}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button className="text-text-light-secondary hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-[20px]">more_vert</span>
                    </button>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                  <tr>
                      <td colSpan={6} className="p-8 text-center text-text-light-secondary">
                          No products found matching "{searchTerm}"
                      </td>
                  </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
import { useMemo, useState } from "react";

import type { Product } from "@/types/dashboard";

interface ProductsPageProps {
  products: Product[];
  searchTerm: string;
  onDelete?: (productId: string) => void;
  onUpdate?: (productId: string, updates: Partial<Product>) => void;
}

const STATUS_STYLES: Record<Product["status"], string> = {
  "In Stock": "bg-green-100 text-green-700",
  "Low Stock": "bg-orange-100 text-orange-700",
  "Out of Stock": "bg-red-100 text-red-700",
};

export function ProductsPage({
  products,
  searchTerm,
  onDelete,
  onUpdate,
}: ProductsPageProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Product>>({});
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const filteredProducts = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase();
    if (!normalized) return products;
    return products.filter((product) =>
      [product.name, product.category].some((value) =>
        value.toLowerCase().includes(normalized)
      )
    );
  }, [products, searchTerm]);

  const handleStartEdit = (product: Product) => {
    setEditingId(product.id);
    setEditForm({ stock: product.stock, price: product.price });
    setMenuOpenId(null);
  };

  const handleSaveEdit = () => {
    if (editingId && onUpdate) {
      onUpdate(editingId, editForm);
      setEditingId(null);
      setEditForm({});
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-text-light-primary">
          Product Inventory
        </h2>
        <div className="flex gap-2">
          <button className="px-4 py-2 text-sm font-medium text-text-light-secondary border border-border-light rounded-lg hover:bg-background-light transition-colors">
            Export
          </button>
          <button className="px-4 py-2 text-sm font-medium text-text-light-secondary border border-border-light rounded-lg hover:bg-background-light transition-colors">
            Filters
          </button>
        </div>
      </div>

      <div className="bg-card-light rounded-xl border border-border-light overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-background-light border-b border-border-light">
                <th className="p-4 text-sm font-bold text-text-light-secondary">
                  Product Name
                </th>
                <th className="p-4 text-sm font-bold text-text-light-secondary">
                  Category
                </th>
                <th className="p-4 text-sm font-bold text-text-light-secondary">
                  Price
                </th>
                <th className="p-4 text-sm font-bold text-text-light-secondary">
                  Stock
                </th>
                <th className="p-4 text-sm font-bold text-text-light-secondary">
                  Status
                </th>
                <th className="p-4 text-sm font-bold text-text-light-secondary text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-border-light hover:bg-background-light transition-colors last:border-0"
                >
                  <td className="p-4">
                    <p className="font-medium text-text-light-primary">
                      {product.name}
                    </p>
                    <p className="text-xs text-text-light-secondary md:hidden">
                      {product.category}
                    </p>
                  </td>
                  <td className="p-4 text-sm text-text-light-secondary hidden md:table-cell">
                    {product.category}
                  </td>
                  <td className="p-4 text-sm font-medium text-text-light-primary">
                    {editingId === product.id ? (
                      <input
                        type="number"
                        step="0.01"
                        value={editForm.price ?? product.price}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            price: Number(e.target.value),
                          })
                        }
                        className="w-20 px-2 py-1 border border-border-light rounded text-sm"
                      />
                    ) : (
                      `$${product.price.toFixed(2)}`
                    )}
                  </td>
                  <td className="p-4 text-sm text-text-light-secondary">
                    {editingId === product.id ? (
                      <input
                        type="number"
                        value={editForm.stock ?? product.stock}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            stock: Number(e.target.value),
                          })
                        }
                        className="w-16 px-2 py-1 border border-border-light rounded text-sm"
                      />
                    ) : (
                      product.stock
                    )}
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        STATUS_STYLES[product.status]
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="p-4 text-right relative">
                    {editingId === product.id ? (
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={handleSaveEdit}
                          className="text-green-600 hover:text-green-700 transition-colors"
                          title="Save"
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            check
                          </span>
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="text-red-600 hover:text-red-700 transition-colors"
                          title="Cancel"
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            close
                          </span>
                        </button>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() =>
                            setMenuOpenId(
                              menuOpenId === product.id ? null : product.id
                            )
                          }
                          className="text-text-light-secondary hover:text-primary transition-colors"
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            more_vert
                          </span>
                        </button>
                        {menuOpenId === product.id && (
                          <div className="absolute right-4 top-12 z-10 bg-white border border-border-light rounded-lg shadow-lg py-1 min-w-[120px]">
                            <button
                              onClick={() => handleStartEdit(product)}
                              className="w-full px-4 py-2 text-left text-sm text-text-light-primary hover:bg-background-light flex items-center gap-2"
                            >
                              <span className="material-symbols-outlined text-[18px]">
                                edit
                              </span>
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                setMenuOpenId(null);
                                onDelete?.(product.id);
                              }}
                              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                            >
                              <span className="material-symbols-outlined text-[18px]">
                                delete
                              </span>
                              Delete
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="p-8 text-center text-text-light-secondary"
                  >
                    {searchTerm
                      ? `No products found matching "${searchTerm}"`
                      : "No products yet. Add your first product!"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

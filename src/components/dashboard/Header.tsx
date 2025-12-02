"use client";

import type { Dispatch, SetStateAction } from "react";

interface HeaderProps {
  searchTerm: string;
  setSearchTerm: Dispatch<SetStateAction<string>>;
  onAddProduct: () => void;
}

export function Header({
  searchTerm,
  setSearchTerm,
  onAddProduct,
}: HeaderProps) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-text-light-primary dark:text-dark-primary">
          Dashboard
        </h1>
        <p className="text-text-light-secondary dark:text-dark-secondary">
          Welcome back, here&apos;s your inventory at a glance.
        </p>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden md:block">
          <label className="flex flex-col min-w-40 h-11 w-72">
            <div className="flex w-full flex-1 items-stretch rounded-lg h-full bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark focus-within:border-primary transition-colors">
              <span className="material-symbols-outlined text-text-light-secondary dark:text-dark-secondary flex items-center justify-center pl-3">
                search
              </span>
              <input
                className="form-input w-full flex-1 resize-none overflow-hidden rounded-lg text-text-light-primary dark:text-dark-primary focus:outline-none focus:ring-0 border-none bg-transparent h-full placeholder:text-text-light-secondary dark:placeholder:text-dark-secondary pl-2 text-sm font-normal"
                placeholder="Search products, orders..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
          </label>
        </div>
        <button
          type="button"
          onClick={onAddProduct}
          className="flex min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-11 px-4 bg-primary hover:bg-primary/90 transition-colors text-white text-sm font-bold shadow-sm active:scale-95"
        >
          <span className="material-symbols-outlined">add</span>
          <span className="truncate">Add New Product</span>
        </button>
      </div>
    </header>
  );
}

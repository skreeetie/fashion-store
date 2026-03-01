"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { mockProducts } from "@/entities/product/model/mock-products";
import { ProductCard } from "@/entities/product/ui/product-card";
import { ProductCardSkeleton } from "@/entities/product/ui/product-card-skeleton";
import clsx from "clsx";

const categories = ["Все", "Одежда", "Обувь", "Аксессуары"];

type FilterButtonProps = {
  label: string;
  icon?: boolean;
  active?: boolean;
};

function FilterButton({ label, icon, active }: FilterButtonProps) {
  return (
    <button
      className={clsx(
        "hover-jolt hover-outline-scan flex items-center gap-2 rounded-sm border border-line px-4 py-2 text-[17px] text-muted",
        active && "text-accent",
      )}
      type="button"
    >
      <span>{label}</span>
      {icon && <ChevronDown size={16} />}
    </button>
  );
}

export function CatalogView() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setIsLoading(false), 1150);
    return () => window.clearTimeout(timeoutId);
  }, []);

  return (
    <section className="mt-10">
      <h1 className="catalog-title text-center text-[clamp(56px,9vw,128px)] uppercase leading-none tracking-[0.04em] text-text">
        Каталог
      </h1>

      <div className="mt-10 border-y border-line py-5">
        <div className="flex flex-wrap items-center justify-center gap-8">
          {categories.map((category, index) => (
            <FilterButton key={category} label={category} active={index === 0} />
          ))}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap justify-end gap-3">
        <FilterButton label="Категория" icon />
        <FilterButton label="Сортировка" icon />
      </div>

      <div className="mt-9 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading
          ? Array.from({ length: 9 }).map((_, idx) => <ProductCardSkeleton key={idx} />)
          : mockProducts.map((product) => <ProductCard key={product.id} product={product} />)}
      </div>
    </section>
  );
}

"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useGetProductsQuery } from "@/entities/product/api/product-api";
import { ProductCard } from "@/entities/product/ui/product-card";
import { ProductCardSkeleton } from "@/entities/product/ui/product-card-skeleton";
import {
  CatalogCategory,
  CatalogSortBy,
  useCatalogQuery,
} from "@/shared/lib/hooks/use-catalog-query";
import clsx from "clsx";

const categories: { label: string; value: CatalogCategory }[] = [
  { label: "Все", value: "all" },
  { label: "Одежда", value: "clothes" },
  { label: "Обувь", value: "shoes" },
  { label: "Аксессуары", value: "accessories" },
];
const ITEMS_PER_PAGE = 21;
const sortOptions: { label: string; value: Exclude<CatalogSortBy, "none"> }[] = [
  { label: "Цена", value: "price" },
  { label: "Название", value: "name" },
];

type CatalogViewProps = {
  title?: string;
  source?: "catalog" | "men" | "women" | "new";
};

export function CatalogView({ title = "Каталог", source = "catalog" }: CatalogViewProps) {
  const { page, setPage, category, setCategory, sortBy, sortOrder, cycleSortBy } = useCatalogQuery({
    defaultPage: 1,
    defaultCategory: "all",
    defaultSortBy: "none",
    defaultSortOrder: "asc",
  });
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const sortMenuRef = useRef<HTMLDivElement | null>(null);
  const { data, isLoading, isFetching, isError } = useGetProductsQuery({
    page,
    perPage: ITEMS_PER_PAGE,
    category,
    sortBy,
    sortOrder,
    source,
  });
  const loading = isLoading || isFetching;
  const totalPages = data?.meta.totalPages ?? 0;
  const total = data?.meta.total ?? 0;
  const shown = data?.products.length ?? 0;
  const shownUntil = shown > 0 ? (page - 1) * ITEMS_PER_PAGE + shown : 0;
  const remaining = Math.max(total - shownUntil, 0);

  useEffect(() => {
    if (totalPages > 0 && page > totalPages) {
      setPage(totalPages);
    }
  }, [page, setPage, totalPages]);

  useEffect(() => {
    if (!isSortMenuOpen) {
      return;
    }

    const onOutsideClick = (event: MouseEvent) => {
      if (!sortMenuRef.current?.contains(event.target as Node)) {
        setIsSortMenuOpen(false);
      }
    };

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsSortMenuOpen(false);
      }
    };

    window.addEventListener("mousedown", onOutsideClick);
    window.addEventListener("keydown", onEscape);

    return () => {
      window.removeEventListener("mousedown", onOutsideClick);
      window.removeEventListener("keydown", onEscape);
    };
  }, [isSortMenuOpen]);

  const visiblePages = useMemo(() => {
    if (totalPages <= 1) {
      return [];
    }

    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, start + 4);
    const normalizedStart = Math.max(1, end - 4);

    return Array.from({ length: end - normalizedStart + 1 }, (_, index) => normalizedStart + index);
  }, [page, totalPages]);

  const currentSortLabel = useMemo(() => {
    if (sortBy === "none") {
      return "Сортировка";
    }

    return sortBy === "price" ? "Цена" : "Название";
  }, [sortBy]);

  const SortIcon = sortBy === "none" ? ChevronDown : sortOrder === "asc" ? ChevronUp : ChevronDown;

  return (
    <section className="mt-6 sm:mt-10">
      <h1 className="catalog-title text-center text-[clamp(42px,9vw,128px)] uppercase leading-none tracking-[0.04em] text-text">
        {title}
      </h1>

      <div className="mt-6 border-y border-line py-4 sm:mt-10 sm:py-5">
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:gap-8">
          {categories.map((item) => (
            <button
              key={item.value}
              type="button"
              className={clsx(
                "hover-jolt hover-outline-scan border-b px-1.5 pb-1 text-sm sm:px-2 sm:text-[17px]",
                item.value === category
                  ? "border-accent font-medium text-accent"
                  : "border-transparent text-muted",
              )}
              onClick={() => setCategory(item.value)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap justify-end gap-2.5 sm:mt-5 sm:gap-3">
        <div className="relative" ref={sortMenuRef}>
          <button
            type="button"
            className={clsx(
              "hover-jolt hover-outline-scan flex items-center gap-2 rounded-sm border border-line px-3 py-1.5 text-sm sm:px-4 sm:py-2 sm:text-[17px]",
              sortBy === "none" ? "text-muted" : "border-accent text-accent",
            )}
            onClick={() => setIsSortMenuOpen((current) => !current)}
          >
            <span>{currentSortLabel}</span>
            <SortIcon size={16} />
          </button>

          {isSortMenuOpen ? (
            <div className="absolute right-0 top-full z-20 mt-2 min-w-[150px] rounded-sm border border-line bg-bg p-1.5 shadow-lg sm:min-w-[170px]">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={clsx(
                    "hover-jolt hover-outline-scan flex w-full items-center justify-between rounded-sm px-3 py-2 text-left text-sm",
                    sortBy === option.value
                      ? "text-accent"
                      : "text-muted",
                  )}
                  onClick={() => {
                    cycleSortBy(option.value);
                    setIsSortMenuOpen(false);
                  }}
                >
                  <span>{option.label}</span>
                  {sortBy === option.value ? (
                    sortOrder === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                  ) : null}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-x-3 gap-y-7 sm:mt-9 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-3">
        {loading
          ? Array.from({ length: ITEMS_PER_PAGE }).map((_, idx) => <ProductCardSkeleton key={idx} />)
          : data?.products.map((product) => <ProductCard key={product.id} product={product} />)}
      </div>

      {isError ? (
        <p className="mt-8 text-center text-sm text-muted">
          Не удалось загрузить товары. Проверь подключение API и базы данных.
        </p>
      ) : null}

      {!loading && total > 0 ? (
        <p className="mt-7 text-center text-xs text-muted sm:mt-10 sm:text-sm">
          Показано: {shownUntil} из {total}. Осталось: {remaining}
        </p>
      ) : null}

      {!loading && totalPages > 1 ? (
        <div className="mt-4 overflow-x-hidden">
          <div className="flex flex-nowrap items-center justify-center gap-1.5 sm:gap-2">
            <button
              type="button"
              className="hover-jolt hover-outline-scan min-w-8 rounded-sm border border-line px-2 py-1.5 text-xs text-muted disabled:cursor-not-allowed disabled:opacity-50 sm:min-w-0 sm:px-3 sm:py-2 sm:text-sm"
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
            >
              <span className="sm:hidden">←</span>
              <span className="hidden sm:inline">Назад</span>
            </button>

            {visiblePages.map((pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                className={clsx(
                  "hover-jolt hover-outline-scan min-w-8 rounded-sm border px-2 py-1.5 text-xs sm:px-3 sm:py-2 sm:text-sm",
                  pageNumber === page
                    ? "border-accent text-accent"
                    : "border-line text-muted",
                )}
                onClick={() => setPage(pageNumber)}
              >
                {pageNumber}
              </button>
            ))}

            <button
              type="button"
              className="hover-jolt hover-outline-scan min-w-8 rounded-sm border border-line px-2 py-1.5 text-xs text-muted disabled:cursor-not-allowed disabled:opacity-50 sm:min-w-0 sm:px-3 sm:py-2 sm:text-sm"
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
            >
              <span className="sm:hidden">→</span>
              <span className="hidden sm:inline">Вперед</span>
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}

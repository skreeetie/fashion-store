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

export function CatalogView() {
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
    <section className="mt-10">
      <h1 className="catalog-title text-center text-[clamp(56px,9vw,128px)] uppercase leading-none tracking-[0.04em] text-text">
        Каталог
      </h1>

      <div className="mt-10 border-y border-line py-5">
        <div className="flex flex-wrap items-center justify-center gap-8">
          {categories.map((item) => (
            <button
              key={item.value}
              type="button"
              className={clsx(
                "hover-jolt hover-outline-scan border-b px-2 pb-1 text-[17px]",
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

      <div className="mt-5 flex flex-wrap justify-end gap-3">
        <div className="relative" ref={sortMenuRef}>
          <button
            type="button"
            className={clsx(
              "hover-jolt hover-outline-scan flex items-center gap-2 rounded-sm border border-line px-4 py-2 text-[17px]",
              sortBy === "none" ? "text-muted" : "border-accent text-accent",
            )}
            onClick={() => setIsSortMenuOpen((current) => !current)}
          >
            <span>{currentSortLabel}</span>
            <SortIcon size={16} />
          </button>

          {isSortMenuOpen ? (
            <div className="absolute right-0 top-full z-20 mt-2 min-w-[170px] rounded-sm border border-line bg-bg p-1.5 shadow-lg">
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

      <div className="mt-9 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
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
        <p className="mt-10 text-center text-sm text-muted">
          Показано: {shownUntil} из {total}. Осталось: {remaining}
        </p>
      ) : null}

      {!loading && totalPages > 1 ? (
        <div className="mt-4">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              className="hover-jolt hover-outline-scan rounded-sm border border-line px-3 py-2 text-sm text-muted disabled:cursor-not-allowed disabled:opacity-50"
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
            >
              Назад
            </button>

            {visiblePages.map((pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                className={clsx(
                  "hover-jolt hover-outline-scan rounded-sm border px-3 py-2 text-sm",
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
              className="hover-jolt hover-outline-scan rounded-sm border border-line px-3 py-2 text-sm text-muted disabled:cursor-not-allowed disabled:opacity-50"
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
            >
              Вперед
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}

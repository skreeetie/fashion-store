"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export type CatalogCategory = "all" | "clothes" | "shoes" | "accessories";
export type CatalogSortBy = "none" | "price" | "name";
export type CatalogSortOrder = "asc" | "desc";

const PAGE_PARAM = "page";
const CATEGORY_PARAM = "category";
const SORT_BY_PARAM = "sortBy";
const SORT_ORDER_PARAM = "sortOrder";
const VALID_CATEGORIES: CatalogCategory[] = ["all", "clothes", "shoes", "accessories"];
const VALID_SORT_BY: CatalogSortBy[] = ["none", "price", "name"];
const VALID_SORT_ORDER: CatalogSortOrder[] = ["asc", "desc"];

type UseCatalogQueryParams = {
  defaultPage?: number;
  defaultCategory?: CatalogCategory;
  defaultSortBy?: CatalogSortBy;
  defaultSortOrder?: CatalogSortOrder;
};

export function useCatalogQuery({
  defaultPage = 1,
  defaultCategory = "all",
  defaultSortBy = "none",
  defaultSortOrder = "asc",
}: UseCatalogQueryParams = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const safePathname = pathname ?? "/";
  const searchParams = useSearchParams();
  const stableParams = useMemo(() => searchParams ?? new URLSearchParams(), [searchParams]);

  const page = useMemo(() => {
    const rawPage = stableParams.get(PAGE_PARAM);
    const parsedPage = Number(rawPage);
    if (!Number.isInteger(parsedPage) || parsedPage < 1) {
      return defaultPage;
    }

    return parsedPage;
  }, [defaultPage, stableParams]);

  const category = useMemo(() => {
    const rawCategory = stableParams.get(CATEGORY_PARAM);
    if (!rawCategory || !VALID_CATEGORIES.includes(rawCategory as CatalogCategory)) {
      return defaultCategory;
    }

    return rawCategory as CatalogCategory;
  }, [defaultCategory, stableParams]);

  const sortBy = useMemo(() => {
    const rawSortBy = stableParams.get(SORT_BY_PARAM);
    if (!rawSortBy || !VALID_SORT_BY.includes(rawSortBy as CatalogSortBy)) {
      return defaultSortBy;
    }

    return rawSortBy as CatalogSortBy;
  }, [defaultSortBy, stableParams]);

  const sortOrder = useMemo(() => {
    const rawSortOrder = stableParams.get(SORT_ORDER_PARAM);
    if (!rawSortOrder || !VALID_SORT_ORDER.includes(rawSortOrder as CatalogSortOrder)) {
      return defaultSortOrder;
    }

    return rawSortOrder as CatalogSortOrder;
  }, [defaultSortOrder, stableParams]);

  const updateQuery = useCallback(
    (
      nextPage: number,
      nextCategory: CatalogCategory,
      nextSortBy: CatalogSortBy,
      nextSortOrder: CatalogSortOrder,
    ) => {
      const params = new URLSearchParams(stableParams.toString());

      if (nextPage <= defaultPage) {
        params.delete(PAGE_PARAM);
      } else {
        params.set(PAGE_PARAM, String(nextPage));
      }

      if (nextCategory === defaultCategory) {
        params.delete(CATEGORY_PARAM);
      } else {
        params.set(CATEGORY_PARAM, nextCategory);
      }

      if (nextSortBy === defaultSortBy) {
        params.delete(SORT_BY_PARAM);
        params.delete(SORT_ORDER_PARAM);
      } else {
        params.set(SORT_BY_PARAM, nextSortBy);
        params.set(SORT_ORDER_PARAM, nextSortOrder);
      }

      const query = params.toString();
      const nextUrl = query ? `${safePathname}?${query}` : safePathname;
      router.replace(nextUrl, { scroll: false });
    },
    [defaultCategory, defaultPage, defaultSortBy, router, safePathname, stableParams],
  );

  const setPage = useCallback(
    (nextPage: number) => {
      const safePage = Number.isInteger(nextPage) && nextPage > 0 ? nextPage : defaultPage;
      updateQuery(safePage, category, sortBy, sortOrder);
    },
    [category, defaultPage, sortBy, sortOrder, updateQuery],
  );

  const setCategory = useCallback(
    (nextCategory: CatalogCategory) => {
      const safeCategory = VALID_CATEGORIES.includes(nextCategory) ? nextCategory : defaultCategory;
      updateQuery(defaultPage, safeCategory, sortBy, sortOrder);
    },
    [defaultCategory, defaultPage, sortBy, sortOrder, updateQuery],
  );

  const cycleSortBy = useCallback(
    (targetSortBy: Exclude<CatalogSortBy, "none">) => {
      if (sortBy !== targetSortBy) {
        updateQuery(defaultPage, category, targetSortBy, "asc");
        return;
      }

      if (sortOrder === "asc") {
        updateQuery(defaultPage, category, targetSortBy, "desc");
        return;
      }

      updateQuery(defaultPage, category, "none", defaultSortOrder);
    },
    [category, defaultPage, defaultSortOrder, sortBy, sortOrder, updateQuery],
  );

  return { page, setPage, category, setCategory, sortBy, sortOrder, cycleSortBy };
}

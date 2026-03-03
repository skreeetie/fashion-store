"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export type CatalogCategory = "all" | "clothes" | "shoes" | "accessories";

const PAGE_PARAM = "page";
const CATEGORY_PARAM = "category";
const VALID_CATEGORIES: CatalogCategory[] = ["all", "clothes", "shoes", "accessories"];

type UseCatalogQueryParams = {
  defaultPage?: number;
  defaultCategory?: CatalogCategory;
};

export function useCatalogQuery({
  defaultPage = 1,
  defaultCategory = "all",
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

  const updateQuery = useCallback(
    (nextPage: number, nextCategory: CatalogCategory) => {
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

      const query = params.toString();
      const nextUrl = query ? `${safePathname}?${query}` : safePathname;
      router.replace(nextUrl, { scroll: false });
    },
    [defaultCategory, defaultPage, router, safePathname, stableParams],
  );

  const setPage = useCallback(
    (nextPage: number) => {
      const safePage = Number.isInteger(nextPage) && nextPage > 0 ? nextPage : defaultPage;
      updateQuery(safePage, category);
    },
    [category, defaultPage, updateQuery],
  );

  const setCategory = useCallback(
    (nextCategory: CatalogCategory) => {
      const safeCategory = VALID_CATEGORIES.includes(nextCategory) ? nextCategory : defaultCategory;
      updateQuery(defaultPage, safeCategory);
    },
    [defaultCategory, defaultPage, updateQuery],
  );

  return { page, setPage, category, setCategory };
}

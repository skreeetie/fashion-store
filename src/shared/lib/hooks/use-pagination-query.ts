"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const PAGE_PARAM = "page";

type UsePaginationQueryParams = {
  defaultPage?: number;
};

export function usePaginationQuery({ defaultPage = 1 }: UsePaginationQueryParams = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = useMemo(() => {
    const rawPage = searchParams.get(PAGE_PARAM);
    const parsedPage = Number(rawPage);

    if (!Number.isInteger(parsedPage) || parsedPage < 1) {
      return defaultPage;
    }

    return parsedPage;
  }, [defaultPage, searchParams]);

  const setPage = useCallback(
    (nextPage: number) => {
      const safePage = Number.isInteger(nextPage) && nextPage > 0 ? nextPage : defaultPage;
      const params = new URLSearchParams(searchParams.toString());

      if (safePage === defaultPage) {
        params.delete(PAGE_PARAM);
      } else {
        params.set(PAGE_PARAM, String(safePage));
      }

      const query = params.toString();
      const nextUrl = query ? `${pathname}?${query}` : pathname;
      router.replace(nextUrl, { scroll: false });
    },
    [defaultPage, pathname, router, searchParams],
  );

  return { page, setPage };
}

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
  const safePathname = pathname ?? "/";
  const searchParams = useSearchParams();
  const stableParams = useMemo(
    () => searchParams ?? new URLSearchParams(),
    [searchParams],
  );

  const page = useMemo(() => {
    const rawPage = stableParams.get(PAGE_PARAM);
    const parsedPage = Number(rawPage);

    if (!Number.isInteger(parsedPage) || parsedPage < 1) {
      return defaultPage;
    }

    return parsedPage;
  }, [defaultPage, stableParams]);

  const setPage = useCallback(
    (nextPage: number) => {
      const safePage = Number.isInteger(nextPage) && nextPage > 0 ? nextPage : defaultPage;
      const params = new URLSearchParams(stableParams.toString());

      if (safePage === defaultPage) {
        params.delete(PAGE_PARAM);
      } else {
        params.set(PAGE_PARAM, String(safePage));
      }

      const query = params.toString();
      const nextUrl = query ? `${safePathname}?${query}` : safePathname;
      router.replace(nextUrl, { scroll: false });
    },
    [defaultPage, router, safePathname, stableParams],
  );

  return { page, setPage };
}

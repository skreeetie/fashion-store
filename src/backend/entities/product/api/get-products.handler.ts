import { NextResponse } from "next/server";
import { getCatalogProducts } from "../service/product.service";
import { productsQuerySchema } from "../model/product-contract";
import { getScopedCatalogProducts } from "../service/scoped-products.service";

export async function getProductsHandler(request: Request) {
  try {
    const parsedQuery = parseProductsQuery(request);
    const data = await getCatalogProducts(parsedQuery);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ message: "Ошибка получения товаров" }, { status: 500 });
  }
}

type ScopedHandlerType = "men" | "women" | "new";

export async function getScopedProductsHandler(request: Request, type: ScopedHandlerType) {
  try {
    const parsedQuery = parseProductsQuery(request);
    const data = await getScopedCatalogProducts(type, parsedQuery);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ message: "Ошибка получения товаров" }, { status: 500 });
  }
}

function parseProductsQuery(request: Request) {
  const url = new URL(request.url);
  return productsQuerySchema.parse({
    page: url.searchParams.get("page") ?? undefined,
    perPage: url.searchParams.get("perPage") ?? undefined,
    category: url.searchParams.get("category") ?? undefined,
    sortBy: url.searchParams.get("sortBy") ?? undefined,
    sortOrder: url.searchParams.get("sortOrder") ?? undefined,
  });
}

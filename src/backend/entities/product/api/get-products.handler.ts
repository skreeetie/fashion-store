import { NextResponse } from "next/server";
import { getCatalogProducts } from "../service/product.service";
import { productsQuerySchema } from "../model/product-contract";

export async function getProductsHandler(request: Request) {
  try {
    const url = new URL(request.url);
    const parsedQuery = productsQuerySchema.parse({
      page: url.searchParams.get("page") ?? undefined,
      perPage: url.searchParams.get("perPage") ?? undefined,
    });

    const data = await getCatalogProducts(parsedQuery);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ message: "Ошибка получения товаров" }, { status: 500 });
  }
}

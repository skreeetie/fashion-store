import { NextResponse } from "next/server";
import { getCatalogProducts } from "../service/product.service";

export async function getProductsHandler() {
  try {
    const products = await getCatalogProducts();
    return NextResponse.json({ products });
  } catch {
    return NextResponse.json({ message: "Ошибка получения товаров" }, { status: 500 });
  }
}

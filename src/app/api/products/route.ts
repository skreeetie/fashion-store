import { getProductsHandler } from "@/backend/entities/product/api/get-products.handler";

export async function GET() {
  return getProductsHandler();
}

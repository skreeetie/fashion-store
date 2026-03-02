import { ProductDto } from "../model/product-contract";
import { prisma } from "@/backend/shared/db/prisma";

export async function getProductsFromDb(): Promise<ProductDto[]> {
  const products = await prisma.product.findMany({
    orderBy: { id: "asc" },
    select: {
      id: true,
      slug: true,
      name: true,
      price: true,
      category: true,
      imageUrl: true,
    },
  });

  return products.map((item) => ({
    id: item.id,
    slug: item.slug,
    name: item.name,
    price: item.price,
    category: item.category,
    imageUrl: item.imageUrl,
  }));
}

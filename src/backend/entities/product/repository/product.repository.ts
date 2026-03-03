import { ProductDto } from "../model/product-contract";
import { prisma } from "@/backend/shared/db/prisma";

type ProductRow = {
  id: number;
  slug: string;
  name: string;
  price: number;
  category: ProductDto["category"];
  imageUrl: string | null;
};

export async function getProductsFromDb(): Promise<ProductDto[]> {
  const products = (await prisma.product.findMany({
    orderBy: { id: "asc" },
    select: {
      id: true,
      slug: true,
      name: true,
      price: true,
      category: true,
      imageUrl: true,
    },
  })) as ProductRow[];

  return products.map((item: ProductRow) => ({
    id: item.id,
    slug: item.slug,
    name: item.name,
    price: item.price,
    category: item.category,
    imageUrl: item.imageUrl,
  }));
}

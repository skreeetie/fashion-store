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

type GetProductsPageParams = {
  skip: number;
  take: number;
};

export async function getProductsPageFromDb({
  skip,
  take,
}: GetProductsPageParams): Promise<ProductDto[]> {
  const products = (await prisma.product.findMany({
    orderBy: { id: "asc" },
    skip,
    take,
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

export async function countProductsInDb(): Promise<number> {
  return prisma.product.count();
}

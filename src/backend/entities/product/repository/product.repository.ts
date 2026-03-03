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
  category?: Exclude<ProductDto["category"], "ALL">;
};

export async function getProductsPageFromDb({
  skip,
  take,
  category,
}: GetProductsPageParams): Promise<ProductDto[]> {
  const products = (await prisma.product.findMany({
    orderBy: { id: "asc" },
    skip,
    take,
    where: category ? { category } : undefined,
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

type CountProductsParams = {
  category?: Exclude<ProductDto["category"], "ALL">;
};

export async function countProductsInDb({ category }: CountProductsParams = {}): Promise<number> {
  return prisma.product.count({
    where: category ? { category } : undefined,
  });
}

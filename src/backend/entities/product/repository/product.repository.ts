import { CatalogSortOrderQuery, CatalogSortByQuery, ProductDto } from "../model/product-contract";
import { prisma } from "@/backend/shared/db/prisma";

type ProductRow = {
  id: number;
  slug: string;
  name: string;
  price: number;
  category: ProductDto["category"];
  imageUrl: string | null;
  availableSizes: ProductDto["availableSizes"];
};

type GetProductsPageParams = {
  skip: number;
  take: number;
  category?: Exclude<ProductDto["category"], "ALL">;
  sortBy: CatalogSortByQuery;
  sortOrder: CatalogSortOrderQuery;
};

function getOrderBy(sortBy: CatalogSortByQuery, sortOrder: CatalogSortOrderQuery) {
  if (sortBy === "price") {
    return { price: sortOrder } as const;
  }

  if (sortBy === "name") {
    return { name: sortOrder } as const;
  }

  return { id: "asc" } as const;
}

export async function getProductsPageFromDb({
  skip,
  take,
  category,
  sortBy,
  sortOrder,
}: GetProductsPageParams): Promise<ProductDto[]> {
  const products = (await prisma.product.findMany({
    orderBy: getOrderBy(sortBy, sortOrder),
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
      availableSizes: true,
    },
  })) as ProductRow[];

  return products.map((item: ProductRow) => ({
    id: item.id,
    slug: item.slug,
    name: item.name,
    price: item.price,
    category: item.category,
    imageUrl: item.imageUrl,
    availableSizes: item.availableSizes,
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

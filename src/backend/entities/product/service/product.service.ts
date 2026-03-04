import { fallbackProducts } from "../model/fallback-products";
import {
  CatalogCategoryQuery,
  CatalogSortByQuery,
  CatalogSortOrderQuery,
  PaginatedProductsDto,
  ProductDto,
  paginatedProductsSchema,
  ProductsQuery,
} from "../model/product-contract";
import { countProductsInDb, getProductsPageFromDb } from "../repository/product.repository";
import { getPexelsFashionImages } from "./pexels.client";

function enrichProductsWithImages(products: ProductDto[], images: string[]): ProductDto[] {
  if (images.length === 0) {
    return products;
  }

  let nextImageIndex = 0;

  return products.map((product) => {
    if (product.imageUrl) {
      return product;
    }

    const imageUrl = images[nextImageIndex] ?? null;
    nextImageIndex += 1;

    return { ...product, imageUrl };
  });
}

type PaginateParams = {
  products: ProductDto[];
  page: number;
  perPage: number;
  total: number;
};

function toPaginatedPayload({ products, page, perPage, total }: PaginateParams): PaginatedProductsDto {
  return {
    products,
    meta: {
      page,
      perPage,
      total,
      totalPages: total === 0 ? 0 : Math.ceil(total / perPage),
    },
  };
}

function mapCategoryToDb(
  category: CatalogCategoryQuery,
): Exclude<ProductDto["category"], "ALL"> | undefined {
  switch (category) {
    case "clothes":
      return "CLOTHES";
    case "shoes":
      return "SHOES";
    case "accessories":
      return "ACCESSORIES";
    case "all":
    default:
      return undefined;
  }
}

function sortProducts(
  items: ProductDto[],
  sortBy: CatalogSortByQuery,
  sortOrder: CatalogSortOrderQuery,
): ProductDto[] {
  if (sortBy === "none") {
    return items;
  }

  const sorted = [...items];
  const direction = sortOrder === "asc" ? 1 : -1;

  sorted.sort((a, b) => {
    if (sortBy === "price") {
      return (a.price - b.price) * direction;
    }

    return a.name.localeCompare(b.name, "ru") * direction;
  });

  return sorted;
}

export async function getCatalogProducts(query: ProductsQuery): Promise<PaginatedProductsDto> {
  const page = query.page;
  const perPage = query.perPage;
  const category = query.category;
  const sortBy = query.sortBy;
  const sortOrder = query.sortOrder;
  const skip = (page - 1) * perPage;
  const dbCategory = mapCategoryToDb(category);
  const filteredFallbackBase =
    dbCategory === undefined
      ? fallbackProducts
      : fallbackProducts.filter((item) => item.category === dbCategory);
  const filteredFallback = sortProducts(filteredFallbackBase, sortBy, sortOrder);
  let productsPage = filteredFallback.slice(skip, skip + perPage);
  let total = filteredFallback.length;

  try {
    const [dbProducts, dbTotal] = await Promise.all([
      getProductsPageFromDb({
        skip,
        take: perPage,
        category: dbCategory,
        sortBy,
        sortOrder,
      }),
      countProductsInDb({ category: dbCategory }),
    ]);

    if (dbTotal > 0) {
      productsPage = dbProducts;
      total = dbTotal;
    }
  } catch {
    productsPage = filteredFallback.slice(skip, skip + perPage);
    total = filteredFallback.length;
  }

  const missingImageCount = productsPage.filter((product) => !product.imageUrl).length;
  const pexelsImages = await getPexelsFashionImages(missingImageCount);
  const enrichedProducts = enrichProductsWithImages(productsPage, pexelsImages);

  return paginatedProductsSchema.parse(
    toPaginatedPayload({
      products: enrichedProducts,
      page,
      perPage,
      total,
    }),
  );
}

import { fallbackProducts } from "../model/fallback-products";
import {
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

export async function getCatalogProducts(query: ProductsQuery): Promise<PaginatedProductsDto> {
  const page = query.page;
  const perPage = query.perPage;
  const skip = (page - 1) * perPage;
  let productsPage = fallbackProducts.slice(skip, skip + perPage);
  let total = fallbackProducts.length;

  try {
    const [dbProducts, dbTotal] = await Promise.all([
      getProductsPageFromDb({ skip, take: perPage }),
      countProductsInDb(),
    ]);

    if (dbTotal > 0) {
      productsPage = dbProducts;
      total = dbTotal;
    }
  } catch {
    productsPage = fallbackProducts.slice(skip, skip + perPage);
    total = fallbackProducts.length;
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

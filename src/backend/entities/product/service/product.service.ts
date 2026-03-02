import { fallbackProducts } from "../model/fallback-products";
import { ProductDto, productsSchema } from "../model/product-contract";
import { getProductsFromDb } from "../repository/product.repository";
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

export async function getCatalogProducts(): Promise<ProductDto[]> {
  let products = fallbackProducts;

  try {
    const dbProducts = await getProductsFromDb();
    if (dbProducts.length > 0) {
      products = dbProducts;
    }
  } catch {
    products = fallbackProducts;
  }

  const missingImageCount = products.filter((product) => !product.imageUrl).length;
  const pexelsImages = await getPexelsFashionImages(missingImageCount);
  const enrichedProducts = enrichProductsWithImages(products, pexelsImages);

  return productsSchema.parse(enrichedProducts);
}

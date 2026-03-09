import { z } from "zod";

export const productCategorySchema = z.enum(["ALL", "CLOTHES", "SHOES", "ACCESSORIES"]);
export const productSizeSchema = z.enum(["s", "m", "l", "xl", "xxl"]);
export const catalogCategoryQuerySchema = z.enum(["all", "clothes", "shoes", "accessories"]);
export const catalogSortByQuerySchema = z.enum(["none", "price", "name"]);
export const catalogSortOrderQuerySchema = z.enum(["asc", "desc"]);

export const productSchema = z.object({
  id: z.number().int().positive(),
  slug: z.string().min(1),
  name: z.string().min(1),
  price: z.number().int().nonnegative(),
  category: productCategorySchema,
  imageUrl: z.string().url().nullable(),
  availableSizes: z.array(productSizeSchema).min(3).max(5),
  isNew: z.boolean().optional(),
});

export const productsSchema = z.array(productSchema);

export const productsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  perPage: z.coerce.number().int().min(1).max(50).default(21),
  category: catalogCategoryQuerySchema.default("all"),
  sortBy: catalogSortByQuerySchema.default("none"),
  sortOrder: catalogSortOrderQuerySchema.default("asc"),
});

export const productsMetaSchema = z.object({
  page: z.number().int().min(1),
  perPage: z.number().int().min(1),
  total: z.number().int().min(0),
  totalPages: z.number().int().min(0),
});

export const paginatedProductsSchema = z.object({
  products: productsSchema,
  meta: productsMetaSchema,
});

export type ProductDto = z.infer<typeof productSchema>;
export type ProductSize = z.infer<typeof productSizeSchema>;
export type ProductsQuery = z.infer<typeof productsQuerySchema>;
export type PaginatedProductsDto = z.infer<typeof paginatedProductsSchema>;
export type CatalogCategoryQuery = z.infer<typeof catalogCategoryQuerySchema>;
export type CatalogSortByQuery = z.infer<typeof catalogSortByQuerySchema>;
export type CatalogSortOrderQuery = z.infer<typeof catalogSortOrderQuerySchema>;

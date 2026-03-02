import { z } from "zod";

export const productCategorySchema = z.enum(["ALL", "CLOTHES", "SHOES", "ACCESSORIES"]);

export const productSchema = z.object({
  id: z.number().int().positive(),
  slug: z.string().min(1),
  name: z.string().min(1),
  price: z.number().int().nonnegative(),
  category: productCategorySchema,
  imageUrl: z.string().url().nullable(),
});

export const productsSchema = z.array(productSchema);

export type ProductDto = z.infer<typeof productSchema>;

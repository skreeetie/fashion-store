export type Product = {
  id: number;
  slug: string;
  name: string;
  price: number;
  category: "ALL" | "CLOTHES" | "SHOES" | "ACCESSORIES";
  imageUrl: string | null;
};

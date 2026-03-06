export type CartItemSize = "s" | "m" | "l" | "xl" | "xxl";

export type CartItem = {
  id: number;
  slug: string;
  name: string;
  price: number;
  imageUrl: string | null;
  size: CartItemSize;
};

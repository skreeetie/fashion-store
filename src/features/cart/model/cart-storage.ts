import { CartItem } from "@/entities/cart/model/types";

const CART_STORAGE_KEY = "fashion-store-cart";

export function loadCartFromSessionStorage(): CartItem[] {
  try {
    const rawValue = sessionStorage.getItem(CART_STORAGE_KEY);
    if (!rawValue) {
      return [];
    }

    const parsedValue = JSON.parse(rawValue) as unknown;
    if (!Array.isArray(parsedValue)) {
      return [];
    }

    return parsedValue.filter((item) => {
      if (typeof item !== "object" || item === null) {
        return false;
      }

      const candidate = item as Record<string, unknown>;
      return (
        typeof candidate.id === "number" &&
        typeof candidate.slug === "string" &&
        typeof candidate.name === "string" &&
        typeof candidate.price === "number" &&
        (typeof candidate.imageUrl === "string" || candidate.imageUrl === null)
      );
    }) as CartItem[];
  } catch {
    return [];
  }
}

export function saveCartToSessionStorage(items: CartItem[]) {
  try {
    sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore write errors
  }
}

import { CartItem } from "@/entities/cart/model/types";

const CART_STORAGE_KEY = "fashion-store-cart";
const CART_SIZES = new Set(["s", "m", "l", "xl", "xxl"]);

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

    return parsedValue
      .map((item) => {
        if (typeof item !== "object" || item === null) {
          return null;
        }

        const candidate = item as Record<string, unknown>;
        const rawSize = candidate.size;
        const size = typeof rawSize === "string" && CART_SIZES.has(rawSize) ? rawSize : "m";

        if (
          typeof candidate.id !== "number" ||
          typeof candidate.slug !== "string" ||
          typeof candidate.name !== "string" ||
          typeof candidate.price !== "number" ||
          !(typeof candidate.imageUrl === "string" || candidate.imageUrl === null)
        ) {
          return null;
        }

        return {
          id: candidate.id,
          slug: candidate.slug,
          name: candidate.name,
          price: candidate.price,
          imageUrl: candidate.imageUrl,
          size,
        } as CartItem;
      })
      .filter((item): item is CartItem => item !== null);
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

import {
  CatalogSortByQuery,
  CatalogSortOrderQuery,
  PaginatedProductsDto,
  ProductDto,
  ProductsQuery,
  paginatedProductsSchema,
} from "../model/product-contract";
import { getPexelsImagesByQuery } from "./pexels.client";

type ScopedCatalog = "men" | "women" | "new";

type ProductDefinition = {
  type: string;
  category: Exclude<ProductDto["category"], "ALL">;
  queryType: string;
};

const ALL_SIZES = ["s", "m", "l", "xl", "xxl"] as const;

const MEN_COUNT = 78;
const WOMEN_COUNT = 78;
const NEW_COUNT = 30;

const menDefinitions: ProductDefinition[] = [
  { type: "Пальто", category: "CLOTHES", queryType: "coat" },
  { type: "Куртка", category: "CLOTHES", queryType: "jacket" },
  { type: "Футболка", category: "CLOTHES", queryType: "t-shirt" },
  { type: "Поло", category: "CLOTHES", queryType: "polo shirt" },
  { type: "Свитшот", category: "CLOTHES", queryType: "sweatshirt" },
  { type: "Худи", category: "CLOTHES", queryType: "hoodie" },
  { type: "Рубашка", category: "CLOTHES", queryType: "shirt" },
  { type: "Брюки", category: "CLOTHES", queryType: "trousers" },
  { type: "Джинсы", category: "CLOTHES", queryType: "jeans" },
  { type: "Пиджак", category: "CLOTHES", queryType: "blazer" },
  { type: "Кроссовки", category: "SHOES", queryType: "sneakers" },
  { type: "Лоферы", category: "SHOES", queryType: "loafers" },
  { type: "Ботинки", category: "SHOES", queryType: "boots" },
];

const womenDefinitions: ProductDefinition[] = [
  { type: "Платье", category: "CLOTHES", queryType: "dress" },
  { type: "Юбка", category: "CLOTHES", queryType: "skirt" },
  { type: "Блуза", category: "CLOTHES", queryType: "blouse" },
  { type: "Кардиган", category: "CLOTHES", queryType: "cardigan" },
  { type: "Пальто", category: "CLOTHES", queryType: "coat" },
  { type: "Топ", category: "CLOTHES", queryType: "top" },
  { type: "Джинсы", category: "CLOTHES", queryType: "jeans" },
  { type: "Брюки", category: "CLOTHES", queryType: "trousers" },
  { type: "Жакет", category: "CLOTHES", queryType: "blazer" },
  { type: "Кроссовки", category: "SHOES", queryType: "sneakers" },
  { type: "Лоферы", category: "SHOES", queryType: "loafers" },
  { type: "Туфли", category: "SHOES", queryType: "heels" },
  { type: "Сапоги", category: "SHOES", queryType: "boots" },
];

const newDefinitions: ProductDefinition[] = [
  { type: "Бомбер", category: "CLOTHES", queryType: "bomber jacket" },
  { type: "Оверсайз пальто", category: "CLOTHES", queryType: "oversized coat" },
  { type: "Рубашка", category: "CLOTHES", queryType: "shirt" },
  { type: "Кроссовки", category: "SHOES", queryType: "sneakers" },
  { type: "Лоферы", category: "SHOES", queryType: "loafers" },
  { type: "Сумка", category: "ACCESSORIES", queryType: "fashion bag" },
];

const styles = ["базовый", "капсула", "стрит", "винтаж", "минимал", "премиум"];
const palettes = ["графит", "молочный", "черный", "бежевый", "олива", "антрацит"];

const catalogPromiseCache = new Map<ScopedCatalog, Promise<ProductDto[]>>();

function makeSlug(scope: ScopedCatalog, type: string, index: number) {
  const typeSlug = type
    .toLowerCase()
    .replace(/[^a-z0-9а-яё]/gi, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return `${scope}-${typeSlug}-${index + 1}`;
}

function calcPrice(category: ProductDefinition["category"], index: number) {
  const base = category === "CLOTHES" ? 3600 : category === "SHOES" ? 5900 : 2800;
  const spread = (index % 11) * 320;
  return base + spread + Math.floor(index / 11) * 120;
}

function getAvailableSizes(index: number, total: number): ProductDto["availableSizes"] {
  const missingTarget = Math.round(total * 0.28);
  const shuffledIndex = (index * 19) % total;
  if (shuffledIndex >= missingTarget) {
    return [...ALL_SIZES];
  }

  const missingCount = index % 2 === 0 ? 1 : 2;
  const missing = new Set(
    Array.from({ length: missingCount }, (_, offset) => ALL_SIZES[(index + offset) % ALL_SIZES.length]),
  );

  return ALL_SIZES.filter((size) => !missing.has(size));
}

function makeName(type: string, index: number) {
  const style = styles[index % styles.length];
  const palette = palettes[(index + 3) % palettes.length];
  return `${type} ${style} ${palette}`;
}

function mapCategory(category: ProductsQuery["category"]): Exclude<ProductDto["category"], "ALL"> | undefined {
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
  products: ProductDto[],
  sortBy: CatalogSortByQuery,
  sortOrder: CatalogSortOrderQuery,
): ProductDto[] {
  if (sortBy === "none") {
    return products;
  }

  const direction = sortOrder === "asc" ? 1 : -1;
  const sorted = [...products];

  sorted.sort((a, b) => {
    if (sortBy === "price") {
      return (a.price - b.price) * direction;
    }

    return a.name.localeCompare(b.name, "ru") * direction;
  });

  return sorted;
}

async function createCatalogProducts(
  scope: ScopedCatalog,
  basePrompt: string,
  definitions: ProductDefinition[],
  count: number,
  markAsNew: boolean,
): Promise<ProductDto[]> {
  const itemsPerType = Math.ceil(count / definitions.length);
  const imagePools = new Map<string, string[]>();

  await Promise.all(
    definitions.map(async (definition) => {
      const images = await getPexelsImagesByQuery(`${basePrompt} ${definition.queryType}`, itemsPerType + 3);
      imagePools.set(definition.type, images);
    }),
  );

  return Array.from({ length: count }, (_, index) => {
    const definition = definitions[index % definitions.length];
    const imagePool = imagePools.get(definition.type) ?? [];

    return {
      id: index + 1,
      slug: makeSlug(scope, definition.type, index),
      name: makeName(definition.type, index),
      price: calcPrice(definition.category, index),
      category: definition.category,
      imageUrl: imagePool.length > 0 ? imagePool[index % imagePool.length] : null,
      availableSizes: getAvailableSizes(index, count),
      ...(markAsNew ? { isNew: true } : {}),
    };
  });
}

function getCatalog(scope: ScopedCatalog): Promise<ProductDto[]> {
  const cached = catalogPromiseCache.get(scope);
  if (cached) {
    return cached;
  }

  const promise =
    scope === "men"
      ? createCatalogProducts(scope, "man fashion model", menDefinitions, MEN_COUNT, false)
      : scope === "women"
        ? createCatalogProducts(scope, "woman fashion model", womenDefinitions, WOMEN_COUNT, false)
        : createCatalogProducts(scope, "woman fashion model", newDefinitions, NEW_COUNT, true);

  catalogPromiseCache.set(scope, promise);
  return promise;
}

export async function getScopedCatalogProducts(
  scope: ScopedCatalog,
  query: ProductsQuery,
): Promise<PaginatedProductsDto> {
  const page = query.page;
  const perPage = query.perPage;
  const category = mapCategory(query.category);
  const skip = (page - 1) * perPage;
  const products = await getCatalog(scope);

  const filtered = category ? products.filter((item) => item.category === category) : products;
  const sorted = sortProducts(filtered, query.sortBy, query.sortOrder);
  const pageItems = sorted.slice(skip, skip + perPage);

  return paginatedProductsSchema.parse({
    products: pageItems,
    meta: {
      page,
      perPage,
      total: sorted.length,
      totalPages: sorted.length === 0 ? 0 : Math.ceil(sorted.length / perPage),
    },
  });
}

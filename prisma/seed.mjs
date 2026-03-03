import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PEXELS_API_KEY = process.env.PEXELS_API_KEY;
const TARGET_COUNT = 168;

const productDefinitions = [
  { type: "Кардиган", category: "CLOTHES", query: "fashion cardigan women model" },
  { type: "Пальто", category: "CLOTHES", query: "fashion coat model street style" },
  { type: "Плащ", category: "CLOTHES", query: "fashion trench coat model" },
  { type: "Свитер", category: "CLOTHES", query: "fashion sweater model editorial" },
  { type: "Джемпер", category: "CLOTHES", query: "minimal jumper fashion model" },
  { type: "Футболка", category: "CLOTHES", query: "fashion t-shirt model studio" },
  { type: "Рубашка", category: "CLOTHES", query: "linen shirt fashion model" },
  { type: "Пиджак", category: "CLOTHES", query: "blazer fashion model editorial" },
  { type: "Брюки", category: "CLOTHES", query: "tailored trousers fashion model" },
  { type: "Джинсы", category: "CLOTHES", query: "denim jeans fashion model" },
  { type: "Юбка", category: "CLOTHES", query: "skirt fashion model lookbook" },
  { type: "Платье", category: "CLOTHES", query: "dress fashion model studio" },
  { type: "Худи", category: "CLOTHES", query: "hoodie fashion model urban" },
  { type: "Куртка", category: "CLOTHES", query: "fashion jacket model portrait" },
  { type: "Жилет", category: "CLOTHES", query: "fashion vest model lookbook" },
  { type: "Бомбер", category: "CLOTHES", query: "bomber jacket fashion model" },
  { type: "Кроссовки", category: "SHOES", query: "fashion sneakers product lifestyle" },
  { type: "Кеды", category: "SHOES", query: "fashion canvas shoes outfit" },
  { type: "Туфли", category: "SHOES", query: "fashion heels shoes model" },
  { type: "Лоферы", category: "SHOES", query: "fashion loafers shoes style" },
  { type: "Ботинки", category: "SHOES", query: "fashion boots street style" },
  { type: "Сапоги", category: "SHOES", query: "fashion tall boots model" },
  { type: "Носки", category: "SHOES", query: "fashion socks outfit detail" },
  { type: "Сумка", category: "ACCESSORIES", query: "fashion bag accessory product" },
  { type: "Рюкзак", category: "ACCESSORIES", query: "fashion backpack accessory lifestyle" },
  { type: "Ремень", category: "ACCESSORIES", query: "fashion belt accessory outfit" },
  { type: "Шарф", category: "ACCESSORIES", query: "fashion scarf accessory model" },
  { type: "Очки", category: "ACCESSORIES", query: "fashion sunglasses model portrait" },
];

const styles = [
  "минимал",
  "оверсайз",
  "винтаж",
  "урбан",
  "классика",
  "капсула",
  "базовый",
  "premium",
];

const palettes = ["черный", "молочный", "графит", "бежевый", "оливковый", "какао"];

async function fetchPexelsImages(query, needed) {
  if (!PEXELS_API_KEY || needed <= 0) {
    return [];
  }

  const images = [];
  const maxPages = Math.ceil(needed / 40) + 1;

  for (let page = 1; page <= maxPages; page += 1) {
    const url = new URL("https://api.pexels.com/v1/search");
    url.searchParams.set("query", query);
    url.searchParams.set("orientation", "portrait");
    url.searchParams.set("per_page", "40");
    url.searchParams.set("page", String(page));

    const response = await fetch(url.toString(), {
      headers: { Authorization: PEXELS_API_KEY },
    });

    if (!response.ok) {
      break;
    }

    const payload = await response.json();
    const photoUrls = (payload.photos ?? []).map((photo) => photo?.src?.large2x || photo?.src?.large);
    images.push(...photoUrls.filter(Boolean));

    if (photoUrls.length === 0 || images.length >= needed) {
      break;
    }
  }

  return images.slice(0, needed);
}

function makeProductName(type, index) {
  const style = styles[index % styles.length];
  const palette = palettes[(index + 2) % palettes.length];
  return `${type} ${style} ${palette}`;
}

function calcPrice(category, index) {
  const base = category === "CLOTHES" ? 3400 : category === "SHOES" ? 5200 : 2100;
  const spread = (index % 14) * 280;
  const tier = Math.floor(index / 14) * 90;
  return base + spread + tier;
}

function makeSlug(definition, index) {
  const typeSlug = definition.type
    .toLowerCase()
    .replace(/[^a-z0-9а-яё]/gi, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return `${typeSlug}-${index + 1}`;
}

async function main() {
  const itemsPerType = Math.ceil(TARGET_COUNT / productDefinitions.length);
  const imagePoolByType = new Map();

  for (const definition of productDefinitions) {
    const images = await fetchPexelsImages(definition.query, itemsPerType + 2);
    imagePoolByType.set(definition.type, images);
  }

  const products = Array.from({ length: TARGET_COUNT }, (_, index) => {
    const definition = productDefinitions[index % productDefinitions.length];
    const imagePool = imagePoolByType.get(definition.type) ?? [];
    const imageUrl = imagePool.length > 0 ? imagePool[index % imagePool.length] : null;

    return {
      slug: makeSlug(definition, index),
      name: makeProductName(definition.type, index),
      price: calcPrice(definition.category, index),
      category: definition.category,
      imageUrl,
    };
  });

  await prisma.$transaction(async (tx) => {
    await tx.product.deleteMany();
    await tx.product.createMany({
      data: products,
    });
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

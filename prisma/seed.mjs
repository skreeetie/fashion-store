import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const categories = ["CLOTHES", "SHOES", "ACCESSORIES"];
const productTemplates = [
  "Базовый джемпер",
  "Платье миди",
  "Куртка оверсайз",
  "Прямые джинсы",
  "Рубашка льняная",
  "Летний костюм",
  "Трикотажное платье",
  "Футболка хлопковая",
  "Пальто классическое",
  "Джинсовая куртка",
  "Свитшот минимал",
  "Лонгслив базовый",
  "Кардиган мягкий",
  "Брюки палаццо",
  "Юбка макси",
  "Кеды городские",
  "Кроссовки раннер",
  "Ботинки дерби",
  "Сумка хобо",
  "Ремень кожаный",
  "Шарф кашемир",
];

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9а-яё\s-]/gi, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function buildSeedProducts(count) {
  return Array.from({ length: count }, (_, index) => {
    const baseName = productTemplates[index % productTemplates.length];
    const category = categories[index % categories.length];
    const price = 1600 + (index % 12) * 450 + Math.floor(index / 12) * 120;
    const sku = index + 1;
    const name = `${baseName} ${sku}`;
    const slug = `${slugify(baseName)}-${sku}`;

    return {
      slug,
      name,
      price,
      category,
    };
  });
}

async function main() {
  const products = buildSeedProducts(168);

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      create: product,
      update: {
        name: product.name,
        price: product.price,
        category: product.category,
      },
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

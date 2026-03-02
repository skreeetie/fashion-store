import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const products = [
  { slug: "basic-jumper", name: "Базовый джемпер", price: 3200, category: "CLOTHES" },
  { slug: "midi-dress", name: "Платье миди", price: 5900, category: "CLOTHES" },
  { slug: "oversize-jacket", name: "Куртка оверсайз", price: 7500, category: "CLOTHES" },
  { slug: "straight-jeans", name: "Прямые джинсы", price: 4500, category: "CLOTHES" },
  { slug: "linen-shirt", name: "Рубашка льняная", price: 4000, category: "CLOTHES" },
  { slug: "summer-suit", name: "Летний костюм", price: 6800, category: "CLOTHES" },
  { slug: "knit-dress", name: "Трикотажное платье", price: 4700, category: "CLOTHES" },
  { slug: "cotton-tshirt", name: "Футболка хлопковая", price: 1800, category: "CLOTHES" },
  { slug: "classic-coat", name: "Пальто классическое", price: 9900, category: "CLOTHES" },
];

async function main() {
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

-- CreateEnum
CREATE TYPE "public"."ProductCategory" AS ENUM ('ALL', 'CLOTHES', 'SHOES', 'ACCESSORIES');

-- CreateTable
CREATE TABLE "public"."products" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" INTEGER NOT NULL,
    "category" "public"."ProductCategory" NOT NULL DEFAULT 'CLOTHES',
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "products_slug_key" ON "public"."products"("slug");

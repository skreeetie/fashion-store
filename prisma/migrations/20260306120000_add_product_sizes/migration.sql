-- AlterTable
ALTER TABLE "public"."products"
ADD COLUMN "availableSizes" TEXT[] NOT NULL DEFAULT ARRAY['s','m','l','xl','xxl']::TEXT[];

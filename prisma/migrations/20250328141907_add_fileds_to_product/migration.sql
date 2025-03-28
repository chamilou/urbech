-- AlterTable
ALTER TABLE "products" ADD COLUMN     "articleNumber" TEXT,
ADD COLUMN     "isNewProduct" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isTopProduct" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "pricePerUnit" DOUBLE PRECISION;

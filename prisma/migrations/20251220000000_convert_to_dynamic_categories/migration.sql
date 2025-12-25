-- CreateTable: Create product_categories table
CREATE TABLE IF NOT EXISTS "product_categories" (
    "id" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_categories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "product_categories_value_key" ON "product_categories"("value");

-- Insert existing categories (if they don't exist)
INSERT INTO "product_categories" ("id", "value", "label", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'SHAMPOO', 'Shampoo', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM "product_categories" WHERE "value" = 'SHAMPOO');

INSERT INTO "product_categories" ("id", "value", "label", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CONDITIONER', 'Conditioner', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM "product_categories" WHERE "value" = 'CONDITIONER');

INSERT INTO "product_categories" ("id", "value", "label", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'TREATMENT', 'Treatment', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM "product_categories" WHERE "value" = 'TREATMENT');

INSERT INTO "product_categories" ("id", "value", "label", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'STYLING', 'Styling', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM "product_categories" WHERE "value" = 'STYLING');

INSERT INTO "product_categories" ("id", "value", "label", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'COLORING', 'Coloring', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM "product_categories" WHERE "value" = 'COLORING');

INSERT INTO "product_categories" ("id", "value", "label", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'TOOLS', 'Tools', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM "product_categories" WHERE "value" = 'TOOLS');

INSERT INTO "product_categories" ("id", "value", "label", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'ACCESSORIES', 'Accessories', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM "product_categories" WHERE "value" = 'ACCESSORIES');

-- Add categoryId column if it doesn't exist
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "categoryId" TEXT;

-- Create index on categoryId if it doesn't exist
CREATE INDEX IF NOT EXISTS "products_categoryId_idx" ON "products"("categoryId");

-- Convert category enum to TEXT by creating temp column, copying data, and swapping
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "category_temp" TEXT;
UPDATE "products" SET "category_temp" = "category"::TEXT WHERE "category_temp" IS NULL;
ALTER TABLE "products" DROP COLUMN IF EXISTS "category";
ALTER TABLE "products" RENAME COLUMN "category_temp" TO "category";

-- Drop the ProductCategory enum type
DROP TYPE IF EXISTS "ProductCategory";


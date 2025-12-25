-- Convert product category field from String to String[] (array)
-- This allows products to belong to multiple categories

-- Step 1: Add the new categories column as an array
ALTER TABLE "products" ADD COLUMN "categories" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Step 2: Migrate existing data from category to categories array
UPDATE "products" SET "categories" = ARRAY["category"];

-- Step 3: Drop the old category column
ALTER TABLE "products" DROP COLUMN "category";

-- Step 4: Drop the old index on category (it no longer exists)
DROP INDEX IF EXISTS "products_category_idx";

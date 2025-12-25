-- AlterTable: Rename column and change type to array
ALTER TABLE "services" RENAME COLUMN "category" TO "category_old";
ALTER TABLE "services" ADD COLUMN "categories" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Migrate existing data: convert single category to array
UPDATE "services" SET "categories" = ARRAY["category_old"] WHERE "category_old" IS NOT NULL AND "category_old" != '';

-- Drop old column
ALTER TABLE "services" DROP COLUMN "category_old";

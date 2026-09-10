DO $$ BEGIN
  CREATE TYPE "public"."product_status" AS ENUM('listed', 'unlisted', 'discontinued');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

ALTER TABLE "product" ADD COLUMN IF NOT EXISTS "status" "public"."product_status" DEFAULT 'listed' NOT NULL;

-- Migrate existing discontinued stock_status values to the new product status
UPDATE "product" SET "status" = 'discontinued' WHERE "stock_status"::text = 'discontinued';

-- Safely recreate stock_status enum without 'discontinued'
DO $$ BEGIN
  CREATE TYPE "public"."stock_status_new" AS ENUM('in_stock', 'out_of_stock');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

ALTER TABLE "product" ALTER COLUMN "stock_status" DROP DEFAULT;
ALTER TABLE "product" ALTER COLUMN "stock_status" TYPE "public"."stock_status_new" USING (
  CASE
    WHEN "stock_status"::text = 'out_of_stock' OR "stock_status"::text = 'discontinued' THEN 'out_of_stock'::"public"."stock_status_new"
    ELSE 'in_stock'::"public"."stock_status_new"
  END
);
DROP TYPE IF EXISTS "public"."stock_status";
ALTER TYPE "public"."stock_status_new" RENAME TO "stock_status";
ALTER TABLE "product" ALTER COLUMN "stock_status" SET DEFAULT 'in_stock';

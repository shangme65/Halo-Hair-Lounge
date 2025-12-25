-- Drop unused e-commerce tables
-- These tables were never implemented and have no functionality in the application

-- Drop reviews table (foreign keys)
DROP TABLE IF EXISTS "reviews" CASCADE;

-- Drop order_items table (foreign keys to orders and products)
DROP TABLE IF EXISTS "order_items" CASCADE;

-- Drop cart_items table (foreign keys to users and products)
DROP TABLE IF EXISTS "cart_items" CASCADE;

-- Drop orders table (foreign keys to users)
DROP TABLE IF EXISTS "orders" CASCADE;

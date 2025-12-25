-- Create notifications table manually
-- This fixes the "The table `public.notifications` does not exist" error

CREATE TABLE IF NOT EXISTS "public"."notifications" (
    "id" TEXT NOT NULL,
    "type" "public"."NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "link" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "notifications_isRead_idx" ON "public"."notifications"("isRead");
CREATE INDEX IF NOT EXISTS "notifications_createdAt_idx" ON "public"."notifications"("createdAt");

-- Create the NotificationType enum if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'NotificationType') THEN
        CREATE TYPE "public"."NotificationType" AS ENUM ('APPOINTMENT', 'PRODUCT', 'SYSTEM');
    END IF;
END $$;
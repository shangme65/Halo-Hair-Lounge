-- CreateTable
CREATE TABLE "appointment_products" (
    "id" TEXT NOT NULL,
    "appointmentId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "appointment_products_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "appointment_products_appointmentId_idx" ON "appointment_products"("appointmentId");

-- CreateIndex
CREATE INDEX "appointment_products_productId_idx" ON "appointment_products"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "appointment_products_appointmentId_productId_key" ON "appointment_products"("appointmentId", "productId");

-- AddForeignKey
ALTER TABLE "appointment_products" ADD CONSTRAINT "appointment_products_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "appointments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointment_products" ADD CONSTRAINT "appointment_products_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

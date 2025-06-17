/*
  Warnings:

  - You are about to drop the column `amount` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `conceptType` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `detail` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `receiptPdf` on the `Payment` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "amount",
DROP COLUMN "conceptType",
DROP COLUMN "detail",
DROP COLUMN "receiptPdf",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "amountText" DROP NOT NULL,
ALTER COLUMN "amountText" DROP DEFAULT,
ALTER COLUMN "paymentType" DROP DEFAULT,
ALTER COLUMN "number" DROP DEFAULT;

-- CreateTable
CREATE TABLE "PaymentConcept" (
    "id" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,
    "conceptType" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "detail" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentConcept_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PaymentConcept_paymentId_idx" ON "PaymentConcept"("paymentId");

-- AddForeignKey
ALTER TABLE "PaymentConcept" ADD CONSTRAINT "PaymentConcept_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

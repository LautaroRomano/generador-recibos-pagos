-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "phone" TEXT,
ADD COLUMN     "street" TEXT;

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "amountText" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "paymentType" TEXT NOT NULL DEFAULT 'Transferencia';

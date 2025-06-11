/*
  Warnings:

  - You are about to drop the column `concept` on the `Payment` table. All the data in the column will be lost.
  - Added the required column `detail` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "concept",
ADD COLUMN     "conceptType" TEXT NOT NULL DEFAULT 'Mantenimiento',
ADD COLUMN     "detail" TEXT NOT NULL;

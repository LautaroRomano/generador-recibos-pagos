/*
  Warnings:

  - You are about to drop the column `password` on the `Admin` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `Admin` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Admin" DROP COLUMN "password";

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

/*
  Warnings:

  - You are about to drop the column `expire` on the `Otp` table. All the data in the column will be lost.
  - Added the required column `attempt` to the `Otp` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expireAt` to the `Otp` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Otp" DROP COLUMN "expire",
ADD COLUMN     "attempt" INTEGER NOT NULL,
ADD COLUMN     "expireAt" TIMESTAMP(3) NOT NULL;

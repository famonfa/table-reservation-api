/*
  Warnings:

  - You are about to drop the column `date` on the `Reservation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Reservation" DROP COLUMN "date",
ADD COLUMN     "reservationDate" TIMESTAMP(3),
ADD COLUMN     "reservationTime" TEXT;

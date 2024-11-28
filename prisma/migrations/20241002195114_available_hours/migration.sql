/*
  Warnings:

  - You are about to drop the column `availableDays` on the `Table` table. All the data in the column will be lost.
  - You are about to drop the column `endTime` on the `Table` table. All the data in the column will be lost.
  - You are about to drop the column `openTime` on the `Table` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Table" DROP COLUMN "availableDays",
DROP COLUMN "endTime",
DROP COLUMN "openTime",
ADD COLUMN     "availableHours" TEXT[];

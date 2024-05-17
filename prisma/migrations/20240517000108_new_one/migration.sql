/*
  Warnings:

  - Added the required column `metadata` to the `BatchNotification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `metadata` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BatchNotification" ADD COLUMN     "metadata" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "metadata" JSONB NOT NULL;

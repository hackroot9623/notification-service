/*
  Warnings:

  - You are about to drop the column `metadataId` on the `BatchNotification` table. All the data in the column will be lost.
  - You are about to drop the column `metadataId` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the `Metadata` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "BatchNotification" DROP CONSTRAINT "BatchNotification_metadataId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_metadataId_fkey";

-- AlterTable
ALTER TABLE "BatchNotification" DROP COLUMN "metadataId";

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "metadataId";

-- DropTable
DROP TABLE "Metadata";

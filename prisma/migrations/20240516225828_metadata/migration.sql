/*
  Warnings:

  - You are about to drop the column `metadata` on the `BatchNotification` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `Notification` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BatchNotification" DROP COLUMN "metadata",
ADD COLUMN     "metadataId" TEXT;

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "metadata",
ADD COLUMN     "metadataId" TEXT;

-- CreateTable
CREATE TABLE "Metadata" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "content" TEXT,

    CONSTRAINT "Metadata_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_metadataId_fkey" FOREIGN KEY ("metadataId") REFERENCES "Metadata"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BatchNotification" ADD CONSTRAINT "BatchNotification_metadataId_fkey" FOREIGN KEY ("metadataId") REFERENCES "Metadata"("id") ON DELETE SET NULL ON UPDATE CASCADE;

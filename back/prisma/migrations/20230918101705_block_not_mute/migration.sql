/*
  Warnings:

  - You are about to drop the `BlockedOnChannels` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MutedByUserOnChannel` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "BlockedOnChannels" DROP CONSTRAINT "BlockedOnChannels_channelId_fkey";

-- DropForeignKey
ALTER TABLE "BlockedOnChannels" DROP CONSTRAINT "BlockedOnChannels_userId_fkey";

-- DropForeignKey
ALTER TABLE "MutedByUserOnChannel" DROP CONSTRAINT "MutedByUserOnChannel_channel_id_fkey";

-- DropForeignKey
ALTER TABLE "MutedByUserOnChannel" DROP CONSTRAINT "MutedByUserOnChannel_muted_by_user_id_fkey";

-- DropForeignKey
ALTER TABLE "MutedByUserOnChannel" DROP CONSTRAINT "MutedByUserOnChannel_muted_user_id_fkey";

-- DropTable
DROP TABLE "BlockedOnChannels";

-- DropTable
DROP TABLE "MutedByUserOnChannel";

-- CreateTable
CREATE TABLE "BannedOnChannels" (
    "channelId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "BannedOnChannels_pkey" PRIMARY KEY ("channelId","userId")
);

-- CreateTable
CREATE TABLE "_blocked" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_blocked_AB_unique" ON "_blocked"("A", "B");

-- CreateIndex
CREATE INDEX "_blocked_B_index" ON "_blocked"("B");

-- AddForeignKey
ALTER TABLE "BannedOnChannels" ADD CONSTRAINT "BannedOnChannels_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "channels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BannedOnChannels" ADD CONSTRAINT "BannedOnChannels_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_blocked" ADD CONSTRAINT "_blocked_A_fkey" FOREIGN KEY ("A") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_blocked" ADD CONSTRAINT "_blocked_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

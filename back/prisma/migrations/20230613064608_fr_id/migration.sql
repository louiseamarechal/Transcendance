/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `channels` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `channels` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "channels" ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "friend_requests" ADD CONSTRAINT "friend_requests_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "channels_name_key" ON "channels"("name");

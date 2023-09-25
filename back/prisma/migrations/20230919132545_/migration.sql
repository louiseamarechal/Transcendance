/*
  Warnings:

  - The primary key for the `achievements` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `achievements` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id,achievment_name]` on the table `achievements` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "achievements_id_achievment_name_key";

-- AlterTable
ALTER TABLE "achievements" DROP CONSTRAINT "achievements_pkey",
DROP COLUMN "id";

-- CreateIndex
CREATE UNIQUE INDEX "achievements_user_id_achievment_name_key" ON "achievements"("user_id", "achievment_name");

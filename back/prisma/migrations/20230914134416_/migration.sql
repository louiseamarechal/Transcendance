/*
  Warnings:

  - You are about to drop the column `achievement_name` on the `Achievements` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Achievements" DROP COLUMN "achievement_name",
ADD COLUMN     "achievment_name" "Achievement_type" NOT NULL DEFAULT 'NONE';

/*
  Warnings:

  - You are about to drop the column `Achievement` on the `Achievements` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Achievements" DROP COLUMN "Achievement",
ADD COLUMN     "achievement_name" "Achievement_type" NOT NULL DEFAULT 'NONE';

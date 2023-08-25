/*
  Warnings:

  - You are about to drop the column `score` on the `games` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "games" DROP COLUMN "score",
ADD COLUMN     "score1" INTEGER,
ADD COLUMN     "score2" INTEGER;

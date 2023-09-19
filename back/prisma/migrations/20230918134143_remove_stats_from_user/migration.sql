/*
  Warnings:

  - You are about to drop the column `statTotalGame` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `statTotalWin` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "statTotalGame",
DROP COLUMN "statTotalWin";

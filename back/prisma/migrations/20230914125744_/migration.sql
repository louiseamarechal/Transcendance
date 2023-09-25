/*
  Warnings:

  - You are about to drop the column `FirstVictory` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `Level10` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `TenVictories` on the `users` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Achievement_type" AS ENUM ('NONE', 'TENVICTORIES', 'FIRSTVICTORY', 'LEVEL10', 'LOOSER');

-- AlterTable
ALTER TABLE "users" DROP COLUMN "FirstVictory",
DROP COLUMN "Level10",
DROP COLUMN "TenVictories";

-- CreateTable
CREATE TABLE "Achievements" (
    "id" SERIAL NOT NULL,
    "Achievement" "Achievement_type" NOT NULL DEFAULT 'NONE',
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "Achievements_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Achievements" ADD CONSTRAINT "Achievements_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the column `hashedRt` on the `users` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "VisType" ADD VALUE 'PROTECTED';

-- DropIndex
DROP INDEX "users_login_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "hashedRt";

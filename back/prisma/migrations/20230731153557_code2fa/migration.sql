/*
  Warnings:

  - A unique constraint covering the columns `[code2FA]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "code2FA" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_code2FA_key" ON "users"("code2FA");

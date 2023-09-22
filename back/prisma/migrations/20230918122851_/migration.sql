/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `blocked_users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "blocked_users_id_key" ON "blocked_users"("id");

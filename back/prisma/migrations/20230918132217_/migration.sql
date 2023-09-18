/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `friend_requests` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "friend_requests_id_key" ON "friend_requests"("id");

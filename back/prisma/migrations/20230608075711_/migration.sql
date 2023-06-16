/*
  Warnings:

  - The primary key for the `friend_requests` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[from_user_id,to_user_id]` on the table `friend_requests` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "friend_requests" DROP CONSTRAINT "friend_requests_pkey";

-- CreateIndex
CREATE UNIQUE INDEX "friend_requests_from_user_id_to_user_id_key" ON "friend_requests"("from_user_id", "to_user_id");

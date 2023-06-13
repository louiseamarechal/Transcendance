/*
  Warnings:

  - The primary key for the `friend_requests` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `friend_requests` table. All the data in the column will be lost.
  - Added the required column `to_user_id` to the `friend_requests` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "friend_requests" DROP CONSTRAINT "friend_requests_pkey",
DROP COLUMN "id",
ADD COLUMN     "to_user_id" INTEGER NOT NULL,
ADD CONSTRAINT "friend_requests_pkey" PRIMARY KEY ("from_user_id", "to_user_id");

-- AddForeignKey
ALTER TABLE "friend_requests" ADD CONSTRAINT "friend_requests_to_user_id_fkey" FOREIGN KEY ("to_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

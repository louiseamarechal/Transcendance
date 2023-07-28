/*
  Warnings:

  - The primary key for the `MutedByUserOnChannel` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `created_at` on the `MutedByUserOnChannel` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `MutedByUserOnChannel` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `MutedByUserOnChannel` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MutedByUserOnChannel" DROP CONSTRAINT "MutedByUserOnChannel_pkey",
DROP COLUMN "created_at",
DROP COLUMN "id",
DROP COLUMN "updated_at",
ADD CONSTRAINT "MutedByUserOnChannel_pkey" PRIMARY KEY ("channel_id", "muted_user_id", "muted_by_user_id");

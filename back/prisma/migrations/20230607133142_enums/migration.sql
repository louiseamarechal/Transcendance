/*
  Warnings:

  - You are about to drop the column `public` on the `channels` table. All the data in the column will be lost.
  - You are about to drop the column `request_pending` on the `friend_requests` table. All the data in the column will be lost.
  - You are about to drop the column `active2fa` on the `users` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Status2fa" AS ENUM ('SET', 'NOTSET');

-- CreateEnum
CREATE TYPE "FRStatus" AS ENUM ('PENDING', 'REFUSED', 'ACCEPTED');

-- CreateEnum
CREATE TYPE "VisType" AS ENUM ('PUBLIC', 'PRIVATE');

-- AlterTable
ALTER TABLE "channels" DROP COLUMN "public",
ADD COLUMN     "visibility" "VisType" NOT NULL DEFAULT 'PUBLIC';

-- AlterTable
ALTER TABLE "friend_requests" DROP COLUMN "request_pending",
ADD COLUMN     "status" "FRStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "games" ALTER COLUMN "score" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "active2fa",
ADD COLUMN     "s2fa" "Status2fa" NOT NULL DEFAULT 'NOTSET';

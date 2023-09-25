/*
  Warnings:

  - The values [NONE] on the enum `Achievement_type` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[id,achievment_name]` on the table `achievements` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Achievement_type_new" AS ENUM ('TENVICTORIES', 'FIRSTVICTORY', 'LEVEL10', 'LOOSER');
ALTER TABLE "achievements" ALTER COLUMN "achievment_name" DROP DEFAULT;
ALTER TABLE "achievements" ALTER COLUMN "achievment_name" TYPE "Achievement_type_new" USING ("achievment_name"::text::"Achievement_type_new");
ALTER TYPE "Achievement_type" RENAME TO "Achievement_type_old";
ALTER TYPE "Achievement_type_new" RENAME TO "Achievement_type";
DROP TYPE "Achievement_type_old";
COMMIT;

-- AlterTable
ALTER TABLE "achievements" ALTER COLUMN "achievment_name" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "achievements_id_achievment_name_key" ON "achievements"("id", "achievment_name");

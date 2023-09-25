/*
  Warnings:

  - You are about to drop the `Achievements` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Achievements" DROP CONSTRAINT "Achievements_user_id_fkey";

-- DropTable
DROP TABLE "Achievements";

-- CreateTable
CREATE TABLE "achievements" (
    "id" SERIAL NOT NULL,
    "achievment_name" "Achievement_type" NOT NULL DEFAULT 'NONE',
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "achievements_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "achievements" ADD CONSTRAINT "achievements_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

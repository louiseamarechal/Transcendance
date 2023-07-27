/*
  Warnings:

  - You are about to drop the column `payer1_id` on the `games` table. All the data in the column will be lost.
  - Added the required column `player1_id` to the `games` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "games" DROP CONSTRAINT "games_payer1_id_fkey";

-- AlterTable
ALTER TABLE "games" DROP COLUMN "payer1_id",
ADD COLUMN     "player1_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "game_queue" (
    "id" SERIAL NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "player_id" INTEGER NOT NULL,

    CONSTRAINT "game_queue_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "games_player1_id_fkey" FOREIGN KEY ("player1_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_queue" ADD CONSTRAINT "game_queue_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

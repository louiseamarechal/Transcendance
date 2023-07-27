/*
  Warnings:

  - You are about to drop the `game_queue` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "game_queue" DROP CONSTRAINT "game_queue_player_id_fkey";

-- DropTable
DROP TABLE "game_queue";

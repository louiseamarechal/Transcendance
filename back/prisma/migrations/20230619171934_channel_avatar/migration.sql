-- DropIndex
DROP INDEX "channels_name_key";

-- AlterTable
ALTER TABLE "channels" ADD COLUMN     "avatar" TEXT,
ALTER COLUMN "name" DROP NOT NULL;

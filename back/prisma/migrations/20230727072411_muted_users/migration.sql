-- CreateTable
CREATE TABLE "MutedByUserOnChannel" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "channel_id" INTEGER NOT NULL,
    "muted_user_id" INTEGER NOT NULL,
    "muted_by_user_id" INTEGER NOT NULL,

    CONSTRAINT "MutedByUserOnChannel_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MutedByUserOnChannel" ADD CONSTRAINT "MutedByUserOnChannel_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "channels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MutedByUserOnChannel" ADD CONSTRAINT "MutedByUserOnChannel_muted_user_id_fkey" FOREIGN KEY ("muted_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MutedByUserOnChannel" ADD CONSTRAINT "MutedByUserOnChannel_muted_by_user_id_fkey" FOREIGN KEY ("muted_by_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

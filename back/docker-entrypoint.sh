#!/bin/sh

sleep 1
echo "Pushing prisma db"
npx prisma db push

exec "$@"
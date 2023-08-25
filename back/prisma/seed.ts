import { FRStatus, PrismaClient } from '@prisma/client';
import { createUserDto } from '../src/user/dto';

const prisma = new PrismaClient();
const defaultAvatar: string = './default.jpg';

async function createUser({ login, avatar }: createUserDto) {
  return await prisma.user.create({
    data: {
      login,
      name: login,
      avatar,
    },
  });
}

async function createFriendRequest(
  userId1: number,
  userId2: number,
  status: FRStatus,
) {
  return await prisma.friendRequest.create({
    data: {
      fromId: userId1,
      toId: userId2,
      status,
    },
  });
}

// async function createChannel(ownerId: number, members: number[], name: string) {
//   const channel = await prisma.channel.create({
//     data: {
//       ownerId,
//       name,
//     },
//   });

//   await prisma.membersOnChannels.createMany({
//     data: members.map((id: number) => {
//       return { channelId: channel.id, userId: id };
//     }),
//   });
//   return channel;
// }

async function main() {
  const michel = await createUser({
    login: 'Michel',
    avatar: defaultAvatar,
    email: 'michel@42.fr',
  });
  const claude = await createUser({
    login: 'Claude',
    avatar: defaultAvatar,
    email: 'claude@42.fr',
  });
  const yves = await createUser({
    login: 'Yves',
    avatar: defaultAvatar,
    email: 'yves@42.fr',
  });
  const marcel = await createUser({
    login: 'Marcel',
    avatar: defaultAvatar,
    email: 'marcel@42.fr',
  });
  const doris = await createUser({
    login: 'Doris',
    avatar: defaultAvatar,
    email: 'doris@42.fr',
  });
  const josee = await createUser({
    login: 'Josee',
    avatar: defaultAvatar,
    email: 'josee@42.fr',
  });
  const claudine = await createUser({
    login: 'Claudine',
    avatar: defaultAvatar,
    email: 'claudine@42.fr',
  });
  const christiane = await createUser({
    login: 'Christiane',
    avatar: defaultAvatar,
    email: 'christiane@42.fr',
  });
  const micheline = await createUser({
    login: 'Micheline',
    avatar: defaultAvatar,
    email: 'micheline@42.fr',
  });
  const brigitte = await createUser({
    login: 'Brigitte',
    avatar: defaultAvatar,
    email: 'brigitte@42.fr',
  });
  const josiebitch = await createUser({
    login: 'Josie',
    avatar: defaultAvatar,
    email: 'josiebitch@42.fr',
  });
  const roberta = await createUser({
    login: 'Roberta',
    avatar: defaultAvatar,
    email: 'roberta@42.fr',
  });
  const roberto = await createUser({
    login: 'Roberto',
    avatar: defaultAvatar,
    email: 'roberto@42.fr',
  });
  const fr1 = await createFriendRequest(michel.id, yves.id, FRStatus.PENDING);
  const fr2 = await createFriendRequest(
    claude.id,
    marcel.id,
    FRStatus.ACCEPTED,
  );
  // const channel1 = await createChannel(
  //   michel.id,
  //   [michel.id, claude.id, marcel.id],
  //   'les potos',
  // );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

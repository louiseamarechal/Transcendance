import { Test } from '@nestjs/testing';
import { FRStatus, Status2fa, VisType } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';

describe('PrismaService Int', () => {
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    prisma = moduleRef.get(PrismaService);
    await prisma.cleanDb();
  });

  describe('user management', () => {
    describe('create user', () => {
      it('should create simple user', async () => {
        const newUser = await prisma.user.create({
          data: {
            login: 'Jean',
            name: 'Jean',
          },
        });
        expect(newUser.name).toBe('Jean');
        expect(newUser.login).toBe('Jean');
        expect(newUser.level).toBe(1);
        expect(newUser.s2fa).toBe(Status2fa.NOTSET);
        expect(newUser.statTotalGame).toBe(0);
        expect(newUser.statTotalWin).toBe(0);
      });
      it('should create second user', async () => {
        const newUser = await prisma.user.create({
          data: {
            login: 'Michel',
            name: 'Michel',
            avatar: 'myAvatar',
          },
        });
        expect(newUser.name).toBe('Michel');
        expect(newUser.login).toBe('Michel');
        expect(newUser.avatar).toBe('myAvatar');
        expect(newUser.level).toBe(1);
        expect(newUser.s2fa).toBe(Status2fa.NOTSET);
        expect(newUser.statTotalGame).toBe(0);
        expect(newUser.statTotalWin).toBe(0);
      });
      it('should throw on duplicate name', async () => {
        const newUser = await prisma.user
          .create({
            data: {
              name: 'Michel',
              login: 'Michmich',
            },
          })
          .then((user) => expect(user).toBeUndefined())
          .catch((error) => {
            expect(error instanceof PrismaClientKnownRequestError);
            expect(error.code === 'P2002');
          });
      });
      it('should throw on duplicate login', async () => {
        const newUser = await prisma.user
          .create({
            data: {
              name: 'Michou',
              login: 'Michel',
            },
          })
          .then((user) => expect(user).toBeUndefined())
          .catch((error) => {
            expect(error instanceof PrismaClientKnownRequestError);
            expect(error.code === 'P2002');
          });
      });
    });
    describe('get user', () => {
      it('Should get user by id', async () => {
        const newUser = await prisma.user.create({
          data: {
            name: 'Claude',
            login: 'Claude'
          },
        });
        const user = await prisma.user.findUnique({
          where: {
            id: newUser.id,
          },
        });
        expect(user).toEqual(newUser);
      });
      it('Should get user by name', async () => {
        const user = await prisma.user.findUnique({
          where: {
            name: 'Jean',
          },
        });
        expect(user).toBeDefined();
        expect(user?.name).toBe('Jean');
        expect(user?.level).toBe(1);
        expect(user?.s2fa).toBe(Status2fa.NOTSET);
        expect(user?.statTotalGame).toBe(0);
        expect(user?.statTotalWin).toBe(0);
      });
      it('Should get user by login', async () => {
        const user = await prisma.user.findUnique({
          where: {
            login: 'Michel',
          },
        });
        expect(user).toBeDefined();
        expect(user?.name).toBe('Michel');
        expect(user?.level).toBe(1);
        expect(user?.s2fa).toBe(Status2fa.NOTSET);
        expect(user?.statTotalGame).toBe(0);
        expect(user?.statTotalWin).toBe(0);
      });
      it('Should get users with given level', async () => {
        const users = await prisma.user.findMany({
          where: {
            level: 1,
          },
        });
        expect(users).toHaveLength(3);
        users.map((user) => {
          expect(user.level).toBe(1);
        });
      });
    });
    describe('edit user', () => {
      it('Should change level', async () => {
        const user = await prisma.user.update({
          where: {
            name: 'Jean',
          },
          data: {
            level: 42,
          },
        });
        expect(user).toBeDefined();
        expect(user?.level).toBe(42);
      });
      it('Should change avatar', async () => {
        const avatarPath: string = 'my_path/to_my/avatar';
        const user = await prisma.user.update({
          where: {
            name: 'Jean',
          },
          data: {
            avatar: avatarPath,
          },
        });
        expect(user).toBeDefined();
        expect(user?.avatar).toBe(avatarPath);
      });
      it('Should change level', async () => {
        const user = await prisma.user.update({
          where: {
            name: 'Jean',
          },
          data: {
            level: 42,
          },
        });
        expect(user).toBeDefined();
        expect(user?.level).toBe(42);
      });
      it('Should change 2fa', async () => {
        const user = await prisma.user.update({
          where: {
            name: 'Claude',
          },
          data: {
            s2fa: Status2fa.SET,
          },
        });
        expect(user).toBeDefined();
        expect(user?.s2fa).toBe(Status2fa.SET);
      });
      it('Should change total game', async () => {
        const user = await prisma.user.update({
          where: {
            name: 'Jean',
          },
          data: {
            statTotalGame: 42,
          },
        });
        expect(user).toBeDefined();
        expect(user?.statTotalGame).toBe(42);
      });
      it('Should change total win', async () => {
        const user = await prisma.user.update({
          where: {
            name: 'Michel',
          },
          data: {
            statTotalWin: 42,
          },
        });
        expect(user).toBeDefined();
        expect(user?.statTotalWin).toBe(42);
      });
    });
    describe('delete user', () => {
      it('Should delete by id', async () => {
        const user = await prisma.user.findUnique({
          where: {
            name: 'Claude',
          },
        });
        expect(user).toBeDefined();
        const deletedUser = await prisma.user.delete({
          where: {
            id: user?.id,
          },
        });
        expect(deletedUser).toBeDefined();
        expect(deletedUser?.name).toBe(user?.name);
        const users = await prisma.user.findMany();
        expect(users).toHaveLength(2);
      });
      it('Should delete user by name', async () => {
        const deletedUser = await prisma.user.delete({
          where: {
            name: 'Jean',
          },
        });
        expect(deletedUser).toBeDefined();
        const users = await prisma.user.findMany();
        expect(users).toHaveLength(1);
      });
      it('Should delete all users', async () => {
        const batchPayload = await prisma.user.deleteMany();
        expect(batchPayload.count).toBe(1);
        const users = await prisma.user.findMany();
        expect(users).toHaveLength(0);
      });
    });
  });
  describe('friend request management', () => {
    let userId1: number, userId2: number;
    describe('create friend request', () => {
      it('Should create request', async () => {
        const user1 = await prisma.user.create({
          data: {
            login: 'Michel',
            name: 'Michel',
          },
        });
        const user2 = await prisma.user.create({
          data: {
            login: 'Maurice',
            name: 'Maurice',
          },
        });
        expect(user1).toBeDefined();
        expect(user2).toBeDefined();
        userId1 = user1.id;
        userId2 = user2.id;
        const request = await prisma.friendRequest.create({
          data: {
            fromId: user1.id,
            toId: user2.id,
          },
        });
        expect(request).toBeDefined();
        expect(request.fromId).toEqual(user1.id);
        expect(request.toId).toEqual(user2.id);
        expect(request.status).toBe(FRStatus.PENDING);
      });
      it('Should create request', async () => {
        const user3 = await prisma.user.create({
          data: {
            login: 'Justin',
            name: 'Marcel',
          },
        });
        expect(user3).toBeDefined();
        const request = await prisma.friendRequest.create({
          data: {
            fromId: user3.id,
            toId: userId1,
          },
        });
        expect(request).toBeDefined();
        expect(request.toId).toBe(userId1);
        expect(request.fromId).toBe(user3.id);
        expect(request.status).toBe(FRStatus.PENDING);
      });
      it('Should throw on create request', async () => {
        const request = await prisma.friendRequest
          .create({
            data: {
              fromId: userId1,
              toId: userId2,
            },
          })
          .catch((error) => {
            expect(error instanceof PrismaClientKnownRequestError);
            expect(error.code).toBe('P2002');
          });
        expect(request).toBeUndefined();
        const requests = await prisma.friendRequest.findMany();
        expect(requests).toHaveLength(2);
      });
    });
    describe('Get request', () => {
      it('Get request by id', async () => {
        const request = await prisma.friendRequest.findFirst({
          where: {
            fromId: userId1,
            toId: userId2,
          },
        });
        expect(request).toBeDefined();
        expect(request?.status).toBe(FRStatus.PENDING);
      });
      it('Get all requests', async () => {
        const requests = await prisma.friendRequest.findMany();
        expect(requests).toHaveLength(2);
      });
    });
    describe('edit friend request', () => {
      it('Change request status to ACCEPTED', async () => {
        const request = await prisma.friendRequest.update({
          where: {
            fromId_toId: {
              fromId: userId1,
              toId: userId2,
            },
          },
          data: {
            status: FRStatus.ACCEPTED,
          },
        });
        expect(request).toBeDefined();
        expect(request?.status).toBe(FRStatus.ACCEPTED);
      });
      it('Change request status to REFUSED', async () => {
        const request = await prisma.friendRequest.update({
          where: {
            fromId_toId: {
              fromId: userId1,
              toId: userId2,
            },
          },
          data: {
            status: FRStatus.REFUSED,
          },
        });
        expect(request).toBeDefined();
        expect(request?.status).toBe(FRStatus.REFUSED);
      });
    });
    describe('delete friend request', () => {
      it('Should delete by id', async () => {
        const deletedRequest = await prisma.friendRequest.delete({
          where: {
            fromId_toId: {
              fromId: userId1,
              toId: userId2,
            },
          },
        });
        expect(deletedRequest).toBeDefined();
        const requests = await prisma.friendRequest.findMany();
        expect(requests).toHaveLength(1);
      });
      it('Should delete all requests', async () => {
        const batchPayload = await prisma.friendRequest.deleteMany();
        expect(batchPayload.count).toBe(1);
        const requests = await prisma.friendRequest.findMany();
        expect(requests).toHaveLength(0);
        const users = await prisma.user.findMany();
        expect(users).toHaveLength(3);
        await prisma.cleanDb();
      });
			it('Should delete request after user delete', async () => {
        const user = await prisma.user.create({
          data: {
            login: 'JJ',
            name: 'Michel',
          },
        });
				const user2 = await prisma.user.create({
					data: {
            login: 'Marcel',
						name: 'Marcel',
					},
				});
        await prisma.friendRequest.create({
          data: {
            fromId: user.id,
						toId: user2.id,
					},
        });
        await prisma.user.delete({
          where: {
            id: user.id,
          },
        });
        const requests = await prisma.friendRequest.findMany();
        expect(requests).toHaveLength(0);
				await prisma.cleanDb();
      });
    });
  });
  describe('channel management', () => {
    let channelIds: number[] = [],
      userId: number,
      userId2: number;
    describe('Should create channel', () => {
      it('Should create channel', async () => {
        const user = await prisma.user.create({
          data: {
            login: 'Mich',
            name: 'Michel',
          },
        });
        userId = user.id;
        const channel = await prisma.channel.create({
          data: {
            ownerId: userId,
          },
        });
        expect(channel).toBeDefined();
        expect(channel.password).toBeFalsy();
        expect(channel.visibility).toBe(VisType.PUBLIC);
        channelIds.push(channel.id);
      });
      it('Should create channel PUBLIC', async () => {
        const user = await prisma.user.create({
          data: {
            login: 'Marcel',
            name: 'Marcel',
          },
        });
        userId2 = user.id;
        const channel = await prisma.channel.create({
          data: {
            ownerId: userId2,
            visibility: VisType.PUBLIC,
          },
        });
        expect(channel).toBeDefined();
        expect(channel.password).toBeFalsy();
        expect(channel.visibility).toBe(VisType.PUBLIC);
        channelIds.push(channel.id);
      });
      it('Should create channel PRIVATE', async () => {
        const channel = await prisma.channel.create({
          data: {
            ownerId: userId,
            visibility: VisType.PRIVATE,
          },
        });
        expect(channel).toBeDefined();
        expect(channel.password).toBeFalsy();
        expect(channel.visibility).toBe(VisType.PRIVATE);
        channelIds.push(channel.id);
      });
      it('Should create channel PRIVATE with password', async () => {
        const hash: string = 'SomeRandomHashVeryHardToRead';
        const channel = await prisma.channel.create({
          data: {
            ownerId: userId2,
            visibility: VisType.PRIVATE,
            password: true,
            passwordHash: hash,
          },
        });
        expect(channel).toBeDefined();
        expect(channel.password).toBe(true);
        expect(channel.passwordHash).toBe(hash);
        expect(channel.visibility).toBe(VisType.PRIVATE);
        channelIds.push(channel.id);
      });
    });
    describe('Should get channel', () => {
      it('Should get channel by id', async () => {
        const channel = await prisma.channel.findUnique({
          where: {
            id: channelIds[0],
          },
        });
        expect(channel).toBeDefined();
        expect(channel?.ownerId).toBe(userId);
      });
      it('Should throw on unmatched id', async () => {
        const channel = await prisma.channel
          .findUnique({
            where: {
              id: 99,
            },
          })
          .catch((error) => {
            expect(error instanceof PrismaClientKnownRequestError);
            expect(error.code).toBe('P2002');
          });
      });
      it('Should get channel with user id', async () => {
        const channels = await prisma.channel.findMany({
          where: {
            ownerId: userId,
          },
        });
        expect(channels).toHaveLength(2);
      });
      it('Should get all PUBLIC channels', async () => {
        const channels = await prisma.channel.findMany({
          where: {
            visibility: VisType.PUBLIC,
          },
        });
        expect(channels).toHaveLength(2);
      });
      it('Should get all PUBLIC channels', async () => {
        const channels = await prisma.channel.findMany();
        expect(channels).toHaveLength(4);
      });
    });
    describe('Should edit channel', () => {
      it('Should edit channel visibility on id', async () => {
        const channel = await prisma.channel.update({
          where: {
            id: channelIds[0],
          },
          data: {
            visibility: VisType.PRIVATE,
            password: true,
            passwordHash: 'hash',
          },
        });
        expect(channel).toBeDefined();
        expect(channel?.visibility).toBe(VisType.PRIVATE);
        expect(channel?.password).toBe(true);
        expect(channel?.passwordHash).toBe('hash');
      });
    });
    describe('Should delete channel', () => {
      it('Should delete channel by id', async () => {
        const channel = await prisma.channel.delete({
          where: {
            id: channelIds[0],
          },
        });
        expect(channel).toBeDefined();
        const channels = await prisma.channel.findMany();
        expect(channels).toHaveLength(3);
      });
      it('Should delete all PRIVATE channels', async () => {
        const batchPayload = await prisma.channel.deleteMany({
          where: {
            visibility: VisType.PRIVATE,
          },
        });
        expect(batchPayload.count).toBe(2);
        const channels = await prisma.channel.findMany();
        expect(channels).toHaveLength(1);
      });
      it('Should delete all channels', async () => {
        const batchPayload = await prisma.channel.deleteMany();
        expect(batchPayload.count).toBe(1);
        const channels = await prisma.channel.findMany();
        expect(channels).toHaveLength(0);
        await prisma.cleanDb();
      });
      it('Should delete channel after user delete', async () => {
        const user = await prisma.user.create({
          data: {
            login: 'Michael',
            name: 'Michel',
          },
        });
        await prisma.channel.create({
          data: {
            ownerId: user.id,
          },
        });
        await prisma.user.delete({
          where: {
            id: user.id,
          },
        });
        const channels = await prisma.channel.findMany();
        expect(channels).toHaveLength(0);
      });
    });
  });
});

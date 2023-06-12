import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { AuthService } from '../../auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
import { UnauthorizedException } from '@nestjs/common';
import { Tokens } from 'src/auth/types';

async function exchangeCodeMock(code: string): Promise<string> {
  if (code === 'GoodCode') {
    return 'ValidAccessToken';
  } else {
    throw new UnauthorizedException('Nop! (exchangeCode)');
  }
}

async function getUserInfoMock(
  token42: string,
): Promise<{ userLogin: string; userAvatar: string }> {
  const userLogin: string = 'Michel';
  const userAvatar: string = 'myAvatar';
  if (token42 === 'ValidAccessToken') {
    return { userLogin, userAvatar };
  } else {
    throw new UnauthorizedException('Nop! (getUserLogin)');
  }
}

async function getUserInfoMockFailing(
  token42: string,
): Promise<{ userLogin: string; userAvatar: string }> {
  throw new UnauthorizedException('Nop! (getUserLogin)');
}

describe('Auth service Int', () => {
  let auth: AuthService;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    auth = moduleRef.get(AuthService);
    prisma = moduleRef.get(PrismaService);
    await prisma.cleanDb();
    auth.exchangeCode = exchangeCodeMock;
    auth.getUserInfo = getUserInfoMock;
  });

  describe('login', () => {
    describe('Should login with correct code.', () => {
      let userId: number;
      it('Should login first time.', async () => {
        const code: string = 'GoodCode';
        const tokens: Tokens = await auth.login({ code });
        expect(tokens);
        const user = await prisma.user.findUnique({
          where: {
            login: 'Michel',
          },
        });
        expect(user).toBeDefined();
        expect(user?.name).toBe('Michel');
        expect(user?.login).toBe('Michel');
        expect(user?.avatar).toBe('myAvatar');
        expect(user?.hashedRT).toBeDefined();
        if (user?.id) userId = user?.id;
      });
      it('Should logout', async () => {
        await auth.logout(userId);
        const user = await prisma.user.findUnique({
          where: {
            login: 'Michel',
          },
        });
        expect(user?.hashedRT).toBeNull();
      });
      it('Should login again.', async () => {
        const code: string = 'GoodCode';
        const tokens: Tokens = await auth.login({ code });
        expect(tokens);
        const user = await prisma.user.findUnique({
          where: {
            login: 'Michel',
          },
        });
        expect(user?.hashedRT).toBeDefined();
        expect(user?.id).toBe(userId);
        await auth.logout(userId);
      });
    });
    it('Should not login with wrong code.', async () => {
      const code: string = 'WrongCode';
      await auth.login({ code }).catch((error) => {
        expect(error).toBeInstanceOf(UnauthorizedException);
      });
    });
    it('Should not login with wrong access token.', async () => {
      auth.getUserInfo = getUserInfoMockFailing;
      const code: string = 'GoodCode';
      await auth.login({ code }).catch((error) => {
        expect(error).toBeInstanceOf(UnauthorizedException);
      });
      auth.getUserInfo = getUserInfoMock;
    });
  });
  describe('JWT strategy', () => {
    it.todo('Should access route with correct access token.');
    it.todo('Should not access route without access token.');
    it.todo('Should not access route with wrong access token.');
    it.todo('Should refresh tokens and access route.');
  });
});

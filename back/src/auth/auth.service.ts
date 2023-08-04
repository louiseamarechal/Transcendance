import { HttpService } from '@nestjs/axios';
import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import { Tokens } from './types';
import * as argon from 'argon2';
import { createUserDto } from 'src/user/dto';
import { createWriteStream } from 'fs';
import { join } from 'path';
import { Status2fa, User } from '@prisma/client';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private http: HttpService,
    private jwt: JwtService,
    private mail: MailService,
  ) {}

  async login(dto: AuthDto, origin: string): Promise<Tokens> {
    if (!origin) {
      throw new UnauthorizedException('wrong origin - check login service');
    }

    const token42: string = await this.exchangeCode(dto.code, origin);
    const userDto: createUserDto = await this.getUserInfo(token42);

    let user = await this.prisma.user.findUnique({
      where: {
        login: userDto.login,
      },
    });

    if (!user) {
      const avatarFile: string = await this.downloadPhoto(
        userDto.login,
        userDto.avatar,
      );
      console.log(`Create user: ${userDto.login}`);
      user = await this.prisma.user.create({
        data: {
          login: userDto.login,
          name: userDto.login,
          avatar: avatarFile,
        },
      });
    }

    if (user.s2fa === Status2fa.SET) {
      const sixDigitCode = generateSixDigitCode();
      console.log('code 2FA a ete genere aves succes.');
      console.log({ sixDigitCode });

      const hashedCode: string = await argon.hash(sixDigitCode.toString());
      await this.prisma.user.update({
        where: {
          login: userDto.login,
        },
        data: {
          code2FA: hashedCode,
        },
      });
      await this.mail.sendEmail(
        userDto.email,
        'transcendance 2FA',
        `Please enter this code : ${sixDigitCode}`,
      );
    }

    // generate and returns jwts
    const tokens: Tokens = await this.getTokens(user);
    await this.updateRTHash(user.id, tokens.refresh_token);
    return tokens;
  }

  async checkcode(userId: number, code: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { code2FA: true, updatedAt: true },
    });

    if (!user || !user.code2FA) throw new ForbiddenException('Access Denied');

    let date = Date.now();
    const fiveMinutesInMillis = 5 * 60 * 1000;
    const diffiMillis = date - user.updatedAt.getTime();
    if (diffiMillis > fiveMinutesInMillis)
      throw new ForbiddenException('Security code Expired');

    const isMatch = await argon.verify(user.code2FA, code);
    if (!isMatch) throw new ForbiddenException('Access Denied');
    //return isMatch;
  }

  async logout(userId: number) {
    await this.prisma.user.updateMany({
      where: {
        id: userId,
        hashedRT: {
          not: null,
        },
      },
      data: {
        hashedRT: null,
      },
    });
  }

  async refreshTokens(userId: number, rt: string): Promise<Tokens> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user || !user.hashedRT) throw new ForbiddenException('Access Denied');

    const rtMatches = await argon.verify(user.hashedRT, rt);
    if (!rtMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(user);
    await this.updateRTHash(user.id, tokens.refresh_token);
    return tokens;
  }

  // HELPER FUNCTIONS

  async exchangeCode(code: string, origin: string): Promise<string> {
    const axiosConfig: AxiosRequestConfig = {
      method: 'post',
      url: 'https://api.intra.42.fr/oauth/token',
      data: {
        grant_type: 'authorization_code',
        client_id: this.config.get('CLIENT_ID'),
        client_secret: this.config.get('CLIENT_SECRET'),
        code: code,
        redirect_uri: origin + '/callback',
      },
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    // console.log('  Request POST https://api.intra.42.fr/oauth/token');

    const response = await axios(axiosConfig).catch((err) => {
      // console.log('error in axios');
      throw new UnauthorizedException('Nop! (exchangeCode)');
    });
    if (!response.data) {
      console.log('Response does not have data');
      throw new UnauthorizedException('Nop! (exchangeCode)');
    } else {
      return response.data?.access_token;
    }
  }

  async getUserInfo(
    token42: string,
  ): Promise<{ login: string; avatar: string; email: string }> {
    const axiosConfig: AxiosRequestConfig = {
      method: 'get',
      url: 'https://api.intra.42.fr/v2/me',
      headers: {
        Authorization: `Bearer ${token42}`,
      },
    };

    // console.log('  Request GET https://api.intra.42.fr/v2/me');
    const response = await axios(axiosConfig).catch((err) => {
      console.log({ err });
      throw new UnauthorizedException('Nop! (getUserLogin)');
    });

    console.log({ response });
    const login = response.data?.login;
    const avatar = response.data?.image?.link;
    const email: string = response.data.email;
    return { login, avatar, email };
  }

  async getTokens(user: User): Promise<Tokens> {
    const [at, rt] = await Promise.all([
      this.jwt.signAsync(
        {
          sub: user.id,
          id: user.id,
          login: user.login,
          name: user.name,
          avatar: user.avatar,
          level: user.level,
        },
        {
          secret: this.config.get('JWT_ACCESS_SECRET'),
          expiresIn: '15m',
        },
      ),
      this.jwt.signAsync(
        {
          sub: user.id,
        },
        {
          secret: this.config.get('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async updateRTHash(userId: number, rt: string) {
    const hash = await argon.hash(rt);
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        hashedRT: hash,
      },
    });
  }

  async downloadPhoto(userLogin: string, url: string) {
    try {
      const ext = url.split('.').pop();
      const writer = createWriteStream(
        join(process.cwd(), `assets/${userLogin}.${ext}`),
      );
      console.log('dl', join(process.cwd(), `assets/${userLogin}.${ext}`));

      // response variable has to be typed with AxiosResponse<T>
      const response: AxiosResponse<any> = await this.http.axiosRef({
        url: url,
        method: 'GET',
        responseType: 'stream',
      });

      response.data.pipe(writer);
      return `${userLogin}.${ext}`;
    } catch (error) {
      console.log('Could not download photo');
      return 'default.jpg';
    }
  }
}

function generateSixDigitCode() {
  const min = 100000;
  const max = 999999;

  const code = Math.floor(Math.random() * (max - min + 1)) + min;
  return code.toString();
}

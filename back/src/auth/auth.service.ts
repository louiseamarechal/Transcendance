import { HttpService } from '@nestjs/axios';
import { ForbiddenException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import axios, { AxiosRequestConfig } from 'axios';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import { Tokens } from './types';
import * as argon from 'argon2';
import { Response } from 'express';

@Injectable()
export class AuthService {

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private http: HttpService,
    private jwt: JwtService
  ) { }

  async login(dto: AuthDto): Promise<Tokens> {

    // exchange code
    const token42 = await this.exchangeCode(dto.code);
    console.log({ token42 })

    // get info from 42 api
    const { userLogin, userAvatar } = await this.getUserInfo(token42);
    console.log({ userLogin, userAvatar })

    // find or create user
    let user = await this.prisma.user.findUnique({
      where: {
        login: userLogin
      }
    })

    if (!user) {
      console.log('Creating user')
      user = await this.prisma.user.create({
        data: {
          login: userLogin,
          name: userLogin,
          avatar: userAvatar
        }
      })
    }
    console.log({ user })

    // generate and returns jwts
    const tokens = await this.getTokens(user.id)
    await this.updateRtHash(user.id, tokens.refresh_token)
    return tokens;
  }

  async logout(userId: number) {
    await this.prisma.user.updateMany({
      where: {
        id: userId,
        hashedRt: {
          not: null
        }
      },
      data: {
        hashedRt: null
      }
    })
  }

  async refreshTokens(userId: number, rt: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId
      }
    })
    if (!user || !user.hashedRt) throw new ForbiddenException('Access Denied')

    const rtMatches = await argon.verify(user.hashedRt, rt)
    if (!rtMatches) throw new ForbiddenException('Access Denied')

    const tokens = await this.getTokens(user.id)
    await this.updateRtHash(user.id, tokens.refresh_token)
    return tokens;
  }


  // HELPER FUNCTIONS

  async exchangeCode(code: string) {
    const axiosConfig: AxiosRequestConfig = {
      method: 'post',
      url: 'https://api.intra.42.fr/oauth/token',
      data: {
        grant_type: 'authorization_code',
        client_id: this.config.get('CLIENT_ID'),
        client_secret: this.config.get('CLIENT_SECRET'),
        code: code,
        redirect_uri: this.config.get('REDIRECT_URI')
      },
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    };

    // console.log({ axiosConfig });

    const response = await axios(axiosConfig)
      .catch((err) => {
        console.log({ err })
        throw new UnauthorizedException('Nop! (exchangeCode)')
      })

    // console.log({ response });
    return response.data?.access_token
  }

  async getUserInfo(token42: string) {
    const axiosConfig: AxiosRequestConfig = {
      method: 'get',
      url: 'https://api.intra.42.fr/v2/me',
      headers: {
        'Authorization': `Bearer ${token42}`
      }
    };

    const response = await axios(axiosConfig)
      .catch((err) => {
        console.log({ err })
        throw new UnauthorizedException('Nop! (getUserLogin)')
      })

    // console.log({ response })
    const userLogin = response.data?.login;
    const userAvatar = response.data?.image?.link;
    return { userLogin, userAvatar }
  }

  async getTokens(userId: number): Promise<Tokens> {
    const [at, rt] = await Promise.all([
      this.jwt.signAsync({
        sub: userId
      }, {
        secret: this.config.get('JWT_ACCESS_SECRET'),
        expiresIn: '15m'
      }),
      this.jwt.signAsync({
        sub: userId
      }, {
        secret: this.config.get('JWT_REFRESH_SECRET'),
        expiresIn: '7d'
      })
    ])

    return {
      access_token: at,
      refresh_token: rt
    }
  }

  async updateRtHash(userId: number, rt: string) {
    const hash = await argon.hash(rt);
    await this.prisma.user.update({
      where: {
        id: userId
      },
      data: {
        hashedRt: hash
      }
    })

  }
}

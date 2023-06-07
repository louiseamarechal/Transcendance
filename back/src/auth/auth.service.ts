import { HttpService } from '@nestjs/axios';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosRequestConfig } from 'axios';
import { catchError, lastValueFrom, map } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import { Tokens } from './types';

@Injectable()
export class AuthService {

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private httpService: HttpService
  ) { }

  async login(dto: AuthDto) {
    // exchange code
    const token42 = await this.exchangeCode(dto.code);
    console.log({ token42 })

    // get info from 42 api
    const { userLogin, userAvatar } = await this.getUserInfo(token42);
    console.log({ userLogin, userAvatar })

    // find or create user
    const user = await this.prisma.user.findUnique({
      where: {
        login: userLogin
      }
    })
    console.log({ user })
    if (!user) {
      await this.prisma.user.create({
        data: {
          login: userLogin,
          name: userLogin,
          avatar: userAvatar
        }
      })
    }

    // returns jwts
  }

  logout() { }

  refreshTokens() { }


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
}

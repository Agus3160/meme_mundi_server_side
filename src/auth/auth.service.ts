import { HttpException, Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PayloadDto } from './dto/payloadDto';
import { Request } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private env: ConfigService,
  ) {}

  
  extractTokenFromHeader(request: Request, typeAuth: string): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === typeAuth ? token : undefined;
  }

  async signup(createUserDto: CreateUserDto) {
    try {
      const user = await this.userService.create(createUserDto);
      if (user) return null;
    } catch (e) {
      if (e.code === 'P2002')
        throw new HttpException('User already exists', 409);
      throw new HttpException('An error occurred', 500);
    }
  }

  async login(dto: LoginDto) {
    const { email, password } = dto;

    const user = await this.userService.findByEmail(email);
    if (!user) throw new HttpException('User dont exists', 404);

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new HttpException('Invalid credentials', 401);

    const jwtConfig = {
      refreshTokenExpiresIn: this.env.get('refreshTokenExpiresIn'),
      accessTokenExpiresIn: this.env.get('accessTokenExpiresIn'),
      accessTokenSecret: this.env.get('accessTokenSecret'),
      refreshTokenSecret: this.env.get('refreshTokenSecret'),
    };

    const payload = {
      userId: user.id,
      username: user.username,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: jwtConfig.accessTokenSecret,
      expiresIn: jwtConfig.accessTokenExpiresIn,
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: jwtConfig.refreshTokenSecret,
      expiresIn: jwtConfig.refreshTokenExpiresIn,
    });

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
      username: user.username,
      userId: user.id,
      expiresIn: new Date().setTime(
        new Date().getTime() + this.env.get('accessTokenExpiresIn'),
      ),
    };
  }

  async refreshToken(req: Request, payload: PayloadDto) {
    const accessTokenSecret = this.env.get('accessTokenSecret');
    const accessTokenExpiersIn = this.env.get('accessTokenExpiresIn');
    const refreshTokenExpiresIn = this.env.get('refreshTokenExpiresIn');

    const user = await this.userService.findOne(payload.userId);
    if (!user) throw new HttpException('Invalid token', 401);

    const newAccessToken = await this.jwtService.signAsync(
      {
        userId: user.id,
        username: user.username,
      },
      {
        secret: accessTokenSecret,
        expiresIn: accessTokenExpiersIn,
      },
    );

    const now = Date.now();
    const exp = new Date(payload.exp * 1000);

    const timeBeforeExpiration = exp.getTime() - now;

    if (
      timeBeforeExpiration > 0 &&
      timeBeforeExpiration < 1000 * 60 * 60 * 24
    ) {
      const newRefreshToken = await this.jwtService.signAsync(
        {
          userId: user.id,
          username: user.username,
        },
        {
          secret: accessTokenSecret,
          expiresIn: refreshTokenExpiresIn,
        },
      );

      return {
        username: user.username,
        userId: user.id,
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        expiresIn: new Date().setTime(
          new Date().getTime() + accessTokenExpiersIn,
        )
      }
    }

    return {
      username: user.username,
      userId: user.id,
      accessToken: newAccessToken,
      expiresIn: new Date().setTime(
        new Date().getTime() + accessTokenExpiersIn,
      ),
    };
  }
}

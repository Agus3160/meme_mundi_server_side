
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { PayloadDto } from '../dto/payloadDto';
import { extractTokenFromHeader } from '../utils/utils';


@Injectable()
export class AuthRefreshGuard implements CanActivate {
  constructor(private jwtService: JwtService, private env:ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = extractTokenFromHeader(request, 'Refresh');
    
    const refreshTokenSecret = this.env.get('refreshTokenSecret');

    if (!token) throw new UnauthorizedException();
    
    try {
      const payload:PayloadDto = await this.jwtService.verifyAsync(
        token,
        {
          secret: refreshTokenSecret
        }
      );

      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }
}
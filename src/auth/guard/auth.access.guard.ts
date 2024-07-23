
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PayloadDto } from '../dto/payloadDto';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private env:ConfigService, private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.authService.extractTokenFromHeader(request, 'Bearer');
    
    const accessTokenSecret = this.env.get('accessTokenSecret');

    if (!token) throw new UnauthorizedException();
    
    try {
      const payload:PayloadDto = await this.jwtService.verifyAsync(
        token,
        {
          secret: accessTokenSecret
        }
      );
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }
}
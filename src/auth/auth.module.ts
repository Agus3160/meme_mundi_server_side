import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from 'src/utils/interceptors/response.interceptor';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService, 
    UserService, 
    PrismaService, 
    JwtService,
    {
      provide:APP_INTERCEPTOR,
      useClass:ResponseInterceptor
    }
  ],
  
})
export class AuthModule {}

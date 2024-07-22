import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import config from './config/config';
import { envSchema } from './config/env.schema';

@Module({
  imports: [
    UserModule, 
    AuthModule, 
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
      validationSchema: envSchema
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

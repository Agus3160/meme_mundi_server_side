import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { SuccessMessage } from 'src/utils/decorators/success-message.decorator';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './guard/auth.access.guard';
import { AuthRefreshGuard } from './guard/auth.refresh.guard';
import { PayloadDto } from './dto/payloadDto';

@Controller('auth')
export class AuthController {

  constructor(private userService : UserService, private authService: AuthService) {}

  @Post('signup')
  @SuccessMessage('User created successfully')
  async signup(@Body() createUserDto: CreateUserDto) {
    return await this.authService.signup(createUserDto)
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return await this.authService.login(dto)
  }

  @Post('refresh-token')
  @UseGuards(AuthRefreshGuard)
  async refreshToken(@Request() req:any) {
    const payload:PayloadDto = req["user"]
    return await this.authService.refreshToken(req, payload)
  }

  @Get('/')
  @UseGuards(AuthGuard)
  @SuccessMessage('List of all users')
  async findAll() {
    return await this.userService.findAll();
  }

}

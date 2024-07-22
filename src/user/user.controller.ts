import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  async create( createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  async findAll() {
    return this.userService.findAll();
  }

  async findOne( id: string) {
    return this.userService.findOne(id);
  }

  async findByUsername( username: string) {
    return this.userService.findByUsername(username);
  }

  async findByEmail( email: string) {
    return this.userService.findByEmail(email);
  }
}

import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserService {

  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    return await this.prisma.user.create({
      data: {
        username: createUserDto.username,
        email: createUserDto.email,
        name: createUserDto.name,
        password: hashedPassword
      }
    })

  }

  async findAll() {
    return await this.prisma.user.findMany();
  }

  async findOne(id: string) {
    return await this.prisma.user.findUnique({
      where: {
        id
      }
    })
  }

  async findByUsername(username: string) {
    return await this.prisma.user.findUnique({
      where: {
        username
      }
    })
  }

  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: {
        email
      }
    })
  }
}

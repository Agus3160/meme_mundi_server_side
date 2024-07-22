import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsString, IsEmail, IsUUID } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  
  @IsUUID()
  id: string;

  @IsString()
  username:string
  
  @IsEmail()
  email:string

  @IsString()
  name:string
  
  @IsString()
  password:string;

}

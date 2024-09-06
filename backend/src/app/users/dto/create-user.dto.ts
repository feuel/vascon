import { RolesEnum } from '../../../types';
import { IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @IsString()
  @IsNotEmpty()
  last_name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  username: string;

  @IsEnum(RolesEnum)
  role: RolesEnum;

  @IsString()
  password: string;
}

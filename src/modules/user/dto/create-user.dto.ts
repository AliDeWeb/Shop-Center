import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { IUserInput } from 'src/types/user/user.interface';

export class CreateUserDto implements IUserInput {
  @IsNotEmpty({ message: `username must not be empty` })
  @IsString({ message: `username must be string` })
  @MinLength(6, { message: 'username must be at least 6 characters' })
  @MaxLength(20, { message: 'username must be a maximum 20 characters' })
  @Transform(({ value }: { value: string }) => value.trim().toLowerCase())
  @ApiProperty({
    name: 'username',
    example: 'AliDeWeb',
    required: true,
    minLength: 6,
    maxLength: 20,
  })
  username: string;

  @IsNotEmpty({ message: `email must not be empty` })
  @IsEmail({}, { message: 'email is invalid' })
  @MaxLength(40, { message: 'email must be a maximum 40 characters' })
  @Transform(({ value }: { value: string }) => value.trim().toLowerCase())
  @ApiProperty({
    name: 'email',
    example: 'alimoradi0business@gmail.com',
    required: true,
    maxLength: 40,
  })
  email: string;

  @IsNotEmpty({ message: `name must not be empty` })
  @IsString({ message: `name must be string` })
  @MinLength(3, { message: 'name must be at least 3 characters' })
  @MaxLength(30, { message: 'name must be a maximum 30 characters' })
  @Transform(({ value }: { value: string }) => value.trim().toLowerCase())
  @ApiProperty({
    name: 'name',
    example: 'ali moradi',
    required: true,
    minLength: 3,
    maxLength: 30,
  })
  name: string;

  @IsNotEmpty({ message: `password must not be empty` })
  @IsString({ message: `password must be string` })
  @MinLength(8, { message: 'password must be at least 8 characters' })
  @MaxLength(30, { message: 'password must be a maximum 30 characters' })
  @ApiProperty({
    name: 'password',
    example: '12345678',
    required: true,
    minLength: 8,
    maxLength: 30,
  })
  password: string;
}

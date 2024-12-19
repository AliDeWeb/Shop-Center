import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IUser } from '../../../types/user/user.interface';

export class LoginUserDto implements Pick<IUser, 'username' | 'password'> {
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

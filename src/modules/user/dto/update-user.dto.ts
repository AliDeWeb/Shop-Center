import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { IUser } from 'src/types/user/user.interface';

export class UpdateUserDto implements Partial<IUser> {
  @IsString({ message: `username must be string` })
  @IsOptional()
  @Transform(({ value }: { value: string }) => value.trim().toLowerCase())
  @ApiProperty({ name: 'username', example: 'AliDeWeb', required: false })
  username?: string;

  @IsString({ message: `email must be string` })
  @IsOptional()
  @Transform(({ value }: { value: string }) => value.trim().toLowerCase())
  @ApiProperty({ name: 'name', example: 'ali moradi', required: false })
  name?: string;

  @IsString({ message: `password must be string` })
  @IsOptional()
  @ApiProperty({ name: 'password', example: '12345678', required: false })
  password?: string;
}

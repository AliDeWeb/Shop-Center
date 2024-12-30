import { IProduct } from '../../../types/product/product.interface';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProductDto implements Omit<IProduct, 'images'> {
  @IsString({ message: `name must be string` })
  @IsOptional()
  @MinLength(10, { message: 'name must be at least 10 characters' })
  @MaxLength(64, { message: 'name must be a maximum 64 characters' })
  @Transform(({ value }: { value: string }) => value.trim().toLowerCase())
  @ApiProperty({
    name: 'name',
    example: 'MacBook Pro 2024',
    required: true,
    minLength: 10,
    maxLength: 64,
  })
  name: string;

  @IsString({ message: `description must be string` })
  @IsOptional()
  @MinLength(64, { message: 'description must be at least 64 characters' })
  @MaxLength(600, { message: 'description must be a maximum 600 characters' })
  @Transform(({ value }: { value: string }) => value.trim().toLowerCase())
  @ApiProperty({
    name: 'description',
    example: 'MacBook Pro 2024 is ...',
    required: false,
    minLength: 64,
    maxLength: 600,
  })
  description?: string;
}

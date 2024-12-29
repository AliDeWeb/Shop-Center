import { IProduct } from '../../../types/product/product.interface';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto implements IProduct {
  @IsNotEmpty({ message: `name must not be empty` })
  @IsString({ message: `name must be string` })
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

  @IsArray({ message: 'images must be an array' })
  @IsOptional()
  @ArrayMinSize(1, { message: 'images must be a maximum 1 length' })
  @ArrayMaxSize(5, { message: 'images must be a maximum 5 length' })
  @ApiProperty({
    name: 'images',
    required: false,
    default: [],
    minLength: 1,
    maxLength: 5,
  })
  images: string[];

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

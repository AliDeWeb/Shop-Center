import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { path } from '../../../utils/multer/multer.util';
import { ApiProperty } from '@nestjs/swagger';

const length = path.length;

export class DeleteProductImageDto {
  @IsString({ message: 'image must be a string' })
  @IsNotEmpty({ message: 'image must not be empty' })
  @MinLength(length, {
    message: `image must have at least ${length} character`,
  })
  @ApiProperty({
    name: 'image',
    example: 'image path',
    required: true,
    minLength: length,
  })
  image: string;
}

import { Controller, Get, HttpCode, Param } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { MongoIdPipe } from '../../pipes/Mongo/MongoId.pipe';

@Controller('product')
@ApiTags('Product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get(':id')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Get product',
    schema: {
      properties: {
        name: { type: 'string', example: 'samsung' },
        images: { type: 'array', example: ['samsung.jpg'] },
        description: { type: 'string', example: 'samsung is ...' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid param request',
    schema: {
      properties: {
        message: {
          type: 'array',
          example: ['id must be a mongoId'],
        },
        error: {
          type: 'string',
          example: 'Bad Request',
        },
        statusCode: {
          type: 'number',
          example: '400',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
    schema: {
      properties: {
        message: { type: 'string', example: 'Product not found' },
        error: { type: 'string', example: 'error' },
        statusCode: {
          type: 'number',
          example: '404',
        },
      },
    },
  })
  async getProductById(@Param() params: MongoIdPipe) {
    const { name, images, description } =
      await this.productService.getProductById(params.id);

    return { name, images, description };
  }
}

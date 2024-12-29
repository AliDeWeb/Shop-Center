import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiCookieAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { MongoIdPipe } from '../../pipes/Mongo/MongoId.pipe';
import { CreateProductDto } from './dto/create-product.dto';
import { AuthGuard } from '../common/guard/auth.guard';
import { RolesGuard } from '../common/guard/roles.guard';
import { AllowableRoles } from '../../decorators/allowableRoles/allowableRoles.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../../utils/multer/multer.util';

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

  @Post()
  @HttpCode(201)
  @ApiCookieAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @AllowableRoles('owner', 'admin')
  @UseInterceptors(
    FilesInterceptor('images', 5, multerOptions('products', 'image', 5)),
  )
  @ApiResponse({
    status: 201,
    description: 'Create product',
    schema: {
      properties: {
        message: { type: 'string', example: 'Product created' },
        data: {
          properties: {
            name: { type: 'string', example: 'samsung' },
            images: { type: 'array', example: ['samsung.jpg'] },
            description: { type: 'string', example: 'samsung is ...' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid body request',
    schema: {
      properties: {
        message: {
          type: 'array',
          example: [
            'name must be a maximum 64 characters',
            'name must be at least 10 characters',
            'name must be string',
            'name must not be empty',
          ],
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
  async createProduct(
    @Body() body: CreateProductDto,
    @UploadedFiles() files: any,
  ) {
    body.images = files.map(
      (file: any) => `uploads/products/image/${file.filename}`,
    );

    const { name, images, description } =
      await this.productService.createProduct(body);

    return {
      message: 'Product created',
      data: {
        name,
        images,
        description,
      },
    };
  }
}

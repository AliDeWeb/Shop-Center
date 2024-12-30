import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  SerializeOptions,
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
import {
  allowedCategories,
  multerOptions,
} from '../../utils/multer/multer.util';
import { Options } from 'multer';
import { Product } from './entities/product.entity';

const uploadProductImageOptions: {
  option: Options;
  path: string;
} = multerOptions(allowedCategories.Products, 'image', 5);

@Controller('product')
@ApiTags('Product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get(':id')
  @HttpCode(200)
  @UseInterceptors(ClassSerializerInterceptor)
  @SerializeOptions({ type: Product })
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
    FilesInterceptor('images', 5, uploadProductImageOptions.option),
    ClassSerializerInterceptor,
  )
  @SerializeOptions({ type: Product })
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
  @ApiResponse({
    status: 403,
    description: 'user did not provide a valid token',
    schema: {
      properties: {
        message: {
          type: 'string',
          example:
            'login or register to continue! or you do not have permission to do this action',
        },
        error: {
          type: 'string',
          example: 'Forbidden',
        },
        statusCode: {
          type: 'number',
          example: '403',
        },
      },
    },
  })
  async createProduct(
    @Body() body: CreateProductDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    body.images = files.map(
      (file) => `${uploadProductImageOptions.path}/${file.filename}`,
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

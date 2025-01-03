import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Patch,
  SerializeOptions,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  Delete,
} from '@nestjs/common';
import { ApiCookieAuth, ApiResponse, ApiParam, ApiTags } from '@nestjs/swagger';
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
import { UpdateProductDto } from './dto/update-product.dto';
import { DeleteProductImageDto } from './dto/delete-product-image.dto';

const uploadProductImageOptions: {
  option: Options;
  path: string;
} = multerOptions(allowedCategories.PRODUCTS, 'image', 5);

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
  @ApiParam({ name: 'id' })
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

  @Patch('update/:id')
  @HttpCode(201)
  @ApiCookieAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @AllowableRoles('owner', 'admin')
  @UseInterceptors(ClassSerializerInterceptor)
  @SerializeOptions({ type: Product })
  @ApiResponse({
    status: 201,
    description: 'Update product',
    schema: {
      properties: {
        message: { type: 'string', example: 'Product updated' },
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
    description: 'Invalid body or param request',
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
  @ApiParam({ name: 'id' })
  async updateProduct(
    @Param() params: MongoIdPipe,
    @Body() body: UpdateProductDto,
  ) {
    const { name, images, description } =
      await this.productService.updateProduct(params.id, body);

    return {
      message: 'Product updated',
      data: {
        name,
        images,
        description,
      },
    };
  }

  @Delete('delete/:id')
  @HttpCode(201)
  @ApiCookieAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @AllowableRoles('owner', 'admin')
  @ApiResponse({
    status: 201,
    description: 'Delete product',
    schema: {
      properties: {
        message: { type: 'string', example: 'Product deleted' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid body or param request',
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
  @ApiParam({ name: 'id' })
  async deleteProduct(@Param() params: MongoIdPipe) {
    await this.productService.deleteProduct(params.id);

    return { message: 'Product deleted' };
  }

  @Patch('update/:id/img')
  @HttpCode(201)
  @ApiCookieAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @AllowableRoles('owner', 'admin')
  @UseInterceptors(
    FilesInterceptor('images', 1, uploadProductImageOptions.option),
    ClassSerializerInterceptor,
  )
  @SerializeOptions({ type: Product })
  @ApiResponse({
    status: 201,
    description: 'Update product',
    schema: {
      properties: {
        message: { type: 'string', example: 'product updated' },
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
    description: 'this err will happen if images are more than 1',
    schema: {
      properties: {
        message: {
          type: 'string',
          example: 'Unexpected field',
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
  @ApiResponse({
    status: 500,
    description: 'this err will happen if images are 0!',
    schema: {
      properties: {
        message: {
          type: 'string',
          example: 'Internal server error',
        },
        statusCode: {
          type: 'number',
          example: '500',
        },
      },
    },
  })
  @ApiParam({ name: 'id' })
  async addProductImage(
    @Param() params: MongoIdPipe,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    const imagePath = `${uploadProductImageOptions.path}/${files[0].filename}`;

    const { name, description, images } =
      await this.productService.addProductImage(params.id, imagePath);

    return {
      message: 'product updated',
      data: { name, description, images },
    };
  }

  @Delete('delete/:id/img')
  @HttpCode(201)
  @ApiCookieAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @AllowableRoles('owner', 'admin')
  @UseInterceptors(
    FilesInterceptor('images', 1, uploadProductImageOptions.option),
    ClassSerializerInterceptor,
  )
  @SerializeOptions({ type: Product })
  @ApiResponse({
    status: 201,
    description: 'Update product',
    schema: {
      properties: {
        message: { type: 'string', example: 'product updated' },
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
    description: 'this err will happen if images are more than 1',
    schema: {
      properties: {
        message: {
          type: 'string',
          example: 'Unexpected field',
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
  @ApiResponse({
    status: 500,
    description: 'this err will happen if images are 0!',
    schema: {
      properties: {
        message: {
          type: 'string',
          example: 'Internal server error',
        },
        statusCode: {
          type: 'number',
          example: '500',
        },
      },
    },
  })
  @ApiParam({ name: 'id' })
  async deleteProductImage(
    @Param() params: MongoIdPipe,
    @Body() body: DeleteProductImageDto,
  ) {
    const { name, description, images } =
      await this.productService.deleteProductImage(params.id, body.image);

    return {
      message: 'product updated',
      data: { name, description, images },
    };
  }
}

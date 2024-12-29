import { Module } from '@nestjs/common';
import { ProductRepository } from './repo/product.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './entities/product.entity';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
  ],
  providers: [ProductRepository, ProductService],
  controllers: [ProductController],
})
export class ProductModule {}

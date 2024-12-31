import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductRepository } from './repo/product.repository';
import { Schema } from 'mongoose';
import { IProductDocument } from '../../types/product/product.interface';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { removeFiles } from '../../utils/removeFiles/removeFiles.util';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async getProductById(id: Schema.Types.ObjectId): Promise<IProductDocument> {
    const result = await this.productRepository.getById(id);

    if (!result) throw new NotFoundException('Product not found');

    return result;
  }

  async createProduct(body: CreateProductDto): Promise<IProductDocument> {
    return await this.productRepository.create(body);
  }

  async updateProduct(
    id: Schema.Types.ObjectId,
    body: UpdateProductDto,
  ): Promise<IProductDocument> {
    const result = await this.productRepository.update(id, body);

    if (!result) throw new NotFoundException('Product not found');

    return result;
  }

  async deleteProduct(id: Schema.Types.ObjectId): Promise<void> {
    const result = await this.productRepository.delete(id);

    if (!result) throw new NotFoundException('Product not found');

    await removeFiles(result.images);
  }

  async addProductImage(
    id: Schema.Types.ObjectId,
    imagePath: string,
  ): Promise<IProductDocument> {
    const product = await this.getProductById(id);

    product.images.push(imagePath);

    await product.save();

    return product;
  }

  async deleteProductImage(
    id: Schema.Types.ObjectId,
    imagePath: string,
  ): Promise<IProductDocument> {
    const product = await this.getProductById(id);

    const imageIndex = product.images.indexOf(imagePath);

    if (imageIndex === -1)
      throw new NotFoundException('Product image not found');

    product.images.splice(imageIndex, 1);

    await product.save();

    return product;
  }
}

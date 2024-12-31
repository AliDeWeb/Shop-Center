import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductRepository } from './repo/product.repository';
import { Schema } from 'mongoose';
import { IProductDocument } from '../../types/product/product.interface';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

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
  }
}

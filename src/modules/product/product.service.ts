import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductRepository } from './repo/product.repository';
import { Schema } from 'mongoose';
import { IProductDocument } from '../../types/product/product.interface';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async getProductById(id: Schema.Types.ObjectId): Promise<IProductDocument> {
    const result = await this.productRepository.getById(id);

    if (!result) throw new NotFoundException('Product not found');

    return result;
  }
}

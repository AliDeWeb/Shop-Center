import { Repository } from '../../../abstracts/repos/repository.abstract';
import { Product, ProductDocument } from '../entities/product.entity';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ProductRepository extends Repository<ProductDocument> {
  constructor(@InjectModel(Product.name) productModel: Model<ProductDocument>) {
    super(productModel);
  }
}

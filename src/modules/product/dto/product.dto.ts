import { IProduct } from '../../../types/product/product.interface';
import { Expose } from 'class-transformer';

export class Products implements IProduct {
  @Expose()
  name: string;

  @Expose()
  images: string[];

  @Expose()
  description?: string;
}

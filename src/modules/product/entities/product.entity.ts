import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  IProduct,
  IProductDocument,
} from '../../../types/product/product.interface';
import { HydratedDocument } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true })
export class Product
  implements IProduct, Pick<IProductDocument, 'views' | 'sells'>
{
  @Prop({ required: true, type: String })
  name: string;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ type: String })
  description?: string;

  @Prop({ default: 0 })
  sells: number;

  @Prop({ default: 0 })
  views: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

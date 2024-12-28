import { Document } from 'mongoose';

export interface IProduct {
  name: string;

  images: string[];

  description: string;
}

export interface IProductDocument extends Document, IProduct {
  sells: number;

  views: number;
}

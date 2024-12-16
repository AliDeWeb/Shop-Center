import { Document, Schema } from 'mongoose';

export interface IRepository<T extends Document> {
  getById(id: Schema.Types.ObjectId): Promise<(T & Document) | null>;

  create(body: T): Promise<(T & Document) | null>;

  update(id: Schema.Types.ObjectId, body: T): Promise<(T & Document) | null>;

  delete(id: Schema.Types.ObjectId): Promise<(T & Document) | null>;
}

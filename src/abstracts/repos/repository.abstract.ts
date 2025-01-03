import {
  Document,
  FilterQuery,
  Model as MongooseModel,
  Schema,
} from 'mongoose';
import { IRepository } from 'src/types/repo/repo.interface';

export abstract class Repository<T extends Document> implements IRepository<T> {
  protected constructor(private readonly Model: MongooseModel<T>) {}

  getById(id: Schema.Types.ObjectId): Promise<(T & Document) | null> {
    return this.Model.findById(id).exec();
  }

  find(filter: FilterQuery<T>) {
    return this.Model.find(filter).exec();
  }

  create(body: Partial<T>): Promise<T & Document> {
    return this.Model.create(body);
  }

  update(id: Schema.Types.ObjectId, body: Partial<T>): Promise<T & Document> {
    return this.Model.findByIdAndUpdate(id, body, { new: true }).exec();
  }

  delete(id: Schema.Types.ObjectId): Promise<(T & Document) | null> {
    return this.Model.findByIdAndDelete(id).exec();
  }
}

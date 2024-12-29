import { Schema } from 'mongoose';
import { IsMongoId } from 'class-validator';

export class MongoIdPipe {
  @IsMongoId({ message: 'id must be a mongoId' })
  id: Schema.Types.ObjectId;
}

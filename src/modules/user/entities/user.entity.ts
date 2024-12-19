import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import {
  EnumUserRoles,
  IUser,
  IUserDocument,
  UserRole,
} from '../../../types/user/user.interface';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User implements IUser, Pick<IUserDocument, 'role'> {
  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  username: string;

  @Prop({
    type: String,
    enum: EnumUserRoles,
    default: 'user',
  })
  role: UserRole;

  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  email: string;

  @Prop({
    type: String,
    required: true,
  })
  name: string;

  @Prop({
    type: String,
    required: true,
  })
  password: string;

  @Prop({
    type: [String],
    default: [],
  })
  refreshTokens: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ username: 1, email: 1 }, { unique: true });

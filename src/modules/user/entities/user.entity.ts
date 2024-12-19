import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import {
  EnumUserRoles,
  IUser,
  IUserDocument,
  UserRole,
} from '../../../types/user/user.interface';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User
  implements IUser, Pick<IUserDocument, 'role' | 'refreshTokens'>
{
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
    type: [{ token: String, expires_in: Number }],
    default: [],
  })
  refreshTokens: { token: string; expires_in: number }[];
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ username: 1, email: 1 }, { unique: true });

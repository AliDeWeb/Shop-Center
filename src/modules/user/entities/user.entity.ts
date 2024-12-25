import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import {
  EnumUserRoles,
  IUser,
  IUserDocument,
  UserRole,
} from '../../../types/user/user.interface';
import * as bcrypt from 'bcrypt';
import { getEnv } from '../../../utils/getEnv/getEnvs.util';

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

UserSchema.pre<UserDocument>('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(
    this.password,
    Number(getEnv('BCRYPT_SALT')),
  );

  next();
});

UserSchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate() as { password?: string };

  if (!update || !update.password) return next();

  update.password = await bcrypt.hash(
    update.password,
    Number(getEnv('BCRYPT_SALT')),
  );

  this.setUpdate(update);
  next();
});

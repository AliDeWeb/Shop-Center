import { Schema } from 'mongoose';

export type UserRole = 'owner' | 'admin' | 'user';

export interface IUser {
  _id: Schema.Types.ObjectId;

  username: string;

  email: string;

  role: UserRole;

  name: string;

  password: string;

  refreshTokens: string[];
}

export type IUserInput = Omit<IUser, '_id' | 'refreshTokens' | 'role'>;

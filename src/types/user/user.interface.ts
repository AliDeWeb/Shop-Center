import { Document } from 'mongoose';

export type UserRole = 'owner' | 'admin' | 'user';
export const EnumUserRoles: UserRole[] = ['user', 'admin', 'owner'];

export interface IUser {
  username: string;

  email: string;

  name: string;

  password: string;
}
export interface IUserDocument extends Document, IUser {
  role: UserRole;

  refreshTokens: { token: string; expires_in: number }[];
}

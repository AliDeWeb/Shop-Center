import { Document } from 'mongoose';
import { Request } from 'express';

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

  refreshTokens: string[];
}

export interface IUserReq extends Request {
  user: IUserDocument;
}

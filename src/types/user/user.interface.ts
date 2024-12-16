import { Schema } from 'mongoose';

export interface IUser {
  _id: Schema.Types.ObjectId;

  username: string;

  email: string;

  name: string;

  password: string;
}

export type IUserInput = Omit<IUser, '_id'>;

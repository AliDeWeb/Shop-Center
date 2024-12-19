import { IUser } from '../../../types/user/user.interface';
import { Exclude, Expose } from 'class-transformer';

export class User implements IUser {
  @Expose()
  username: string;

  @Expose()
  email: string;

  @Expose()
  name: string;

  @Exclude()
  password: string;
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Repository } from '../../../abstracts/repos/repository.abstract';
import { User, UserDocument } from '../entities/user.entity';
import { Model } from 'mongoose';

@Injectable()
export class UserRepository extends Repository<UserDocument> {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {
    super(userModel);
  }
}

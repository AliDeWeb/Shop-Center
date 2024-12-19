import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { UserRepository } from './repo/user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { FilterQuery, Schema } from 'mongoose';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { IUserDocument } from '../../types/user/user.interface';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getUserById(id: Schema.Types.ObjectId): Promise<IUserDocument> {
    const result = await this.userRepository.getById(id);

    if (!result) throw new NotFoundException('User not found');

    return result;
  }

  async findUser(filter: FilterQuery<User>): Promise<IUserDocument[]> {
    const result = await this.userRepository.find(filter);

    if (!result.length) throw new NotFoundException('User not found');

    return result;
  }

  async createUser(body: CreateUserDto): Promise<IUserDocument> {
    try {
      return await this.userRepository.create(body);
    } catch (err) {
      throw new ConflictException('user exist');
    }
  }

  async updateUser(
    id: Schema.Types.ObjectId,
    body: UpdateUserDto,
  ): Promise<IUserDocument> {
    const result = await this.userRepository.update(id, body);

    if (!result) throw new NotFoundException('User not found');

    return result;
  }

  async deleteUserById(id: Schema.Types.ObjectId): Promise<void> {
    const result = await this.userRepository.delete(id);

    if (!result) throw new NotFoundException('User not found');
  }
}

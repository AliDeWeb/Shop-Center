import {
  Injectable,
  HttpException,
  NotFoundException,
  ConflictException,
  HttpStatus,
} from '@nestjs/common';
import { UserRepository } from './repo/user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { Schema } from 'mongoose';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getUserById(id: Schema.Types.ObjectId) {
    try {
      const result = await this.userRepository.getById(id);

      if (!result) throw new NotFoundException('User not found');

      return result;
    } catch (err) {
      throw new HttpException('server error', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  async createUser(body: CreateUserDto) {
    try {
      return await this.userRepository.create(body);
    } catch (err) {
      throw new ConflictException('user exist');
    }
  }

  async updateUser(id: Schema.Types.ObjectId, body: UpdateUserDto) {
    try {
      const result = await this.updateUser(id, body);

      if (!result) throw new NotFoundException('User not found');

      return result;
    } catch (err) {
      throw new HttpException('server error', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  async deleteUserById(id: Schema.Types.ObjectId) {
    try {
      const result = await this.userRepository.delete(id);

      if (!result) throw new NotFoundException('User not found');
    } catch (err) {
      throw new HttpException('server error', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }
}

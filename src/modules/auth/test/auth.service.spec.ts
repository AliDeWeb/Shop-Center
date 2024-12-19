import { Test } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { testDBUri } from '../../../../test/test-utils';
import { UserModule } from '../../user/user.module';
import { AuthService } from '../auth.service';
import { describe } from 'node:test';
import mongoose from 'mongoose';
import { UserService } from '../../user/user.service';
import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { IUser } from '../../../types/user/user.interface';
import { CommonModule } from '../../common/common.module';

describe('AuthService (unit)', () => {
  let service: AuthService;
  let userService: Partial<Record<keyof UserService, jest.Mock>> = {
    createUser: jest.fn(),
    findUser: jest.fn(),
  };

  beforeAll(async () => {
    process.env.JWT_SECRET_KEY = '1234';
    process.env.JWT_ACCESS_TOKEN_EXPIRES_IN = '15m';
    process.env.JWT_ACCESS_REFRESH_EXPIRES_IN = '7d';
    process.env.BCRYPT_SALT = '6';

    const module = await Test.createTestingModule({
      imports: [MongooseModule.forRoot(testDBUri), CommonModule, UserModule],
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: userService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });
  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('registerUser', () => {
    it('should register a user if user is not exist', async () => {
      const userDto: IUser = {
        name: 'Ali',
        email: 'test@gmail.com',
        password: '12345678',
        username: 'username',
      };

      userService.createUser.mockResolvedValue({
        ...userDto,
        _id: new mongoose.Types.ObjectId(),
        refreshTokens: [],
        save: jest.fn().mockResolvedValue(true),
      });

      const newUser = await service.registerUser(userDto);

      expect(newUser).toMatchObject({
        refreshToken: expect.any(String),
        accessToken: expect.any(String),
      });
    });

    it('should throw an error if user is exist', () => {
      const userDto: IUser = {
        name: 'Ali',
        email: 'test@gmail.com',
        password: '12345678',
        username: 'username',
      };

      userService.createUser.mockRejectedValue(
        new ConflictException('user exist'),
      );

      const newUser = service.registerUser(userDto);

      expect(newUser).rejects.toThrow(ConflictException);
    });
  });

  describe('loginUser', () => {
    it('should login user if user is exist and password is true', async () => {
      const userDto = {
        name: 'Ali',
        email: 'test@gmail.com',
        password: '12345678',
        username: 'username',
        refreshTokens: [],
        save: jest.fn().mockResolvedValue(true),
      };

      userService.findUser.mockResolvedValue([userDto]);

      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      const user = await service.loginUser({
        username: userDto.username,
        password: '',
      });

      expect(user).toMatchObject({
        refreshToken: expect.any(String),
        accessToken: expect.any(String),
      });
    });

    it('should throw an error if password is false', async () => {
      const userDto = {
        name: 'Ali',
        email: 'test@gmail.com',
        password: '12345678',
        username: 'username',
        refreshTokens: [],
        save: jest.fn().mockResolvedValue(true),
      };

      userService.findUser.mockResolvedValue([userDto]);

      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      const user = service.loginUser({
        username: userDto.username,
        password: '',
      });

      expect(user).rejects.toThrow(UnauthorizedException);
    });

    it('should throw an error if user is not exist', async () => {
      userService.findUser.mockRejectedValue(
        new NotFoundException('User not found'),
      );

      const user = service.loginUser({
        username: '',
        password: '',
      });

      expect(user).rejects.toThrow(NotFoundException);
    });
  });
});

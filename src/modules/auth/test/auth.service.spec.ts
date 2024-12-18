import { Test } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { testDBUri } from '../../../../test/test-utils';
import { UserModule } from '../../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { getEnv } from '../../../utils/getEnv/getEnvs.util';
import { AuthService } from '../auth.service';
import { describe } from 'node:test';
import mongoose from 'mongoose';
import { IUserInput } from '../../../types/user/user.interface';
import { UserService } from '../../user/user.service';
import { ConflictException } from '@nestjs/common';

describe('AuthService (unit)', () => {
  let service: AuthService;
  let userService: Partial<Record<keyof UserService, jest.Mock>> = {
    createUser: jest.fn(),
  };

  beforeAll(async () => {
    process.env.JWT_SECRET_KEY = '1234';
    process.env.JWT_ACCESS_TOKEN_EXPIRES_IN = '15m';
    process.env.JWT_ACCESS_REFRESH_EXPIRES_IN = '7d';
    process.env.BCRYPT_SALT = '6';

    const module = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(testDBUri),
        JwtModule.registerAsync({
          useFactory: async () => ({ secret: getEnv('JWT_SECRET_KEY') }),
        }),
        UserModule,
      ],
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
      const userDto: IUserInput = {
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
      const userDto: IUserInput = {
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
});

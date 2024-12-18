import { Test } from '@nestjs/testing';
import { UserModule } from '../../user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { testDBUri } from '../../../../test/test-utils';
import { JwtModule } from '@nestjs/jwt';
import { getEnv } from '../../../utils/getEnv/getEnvs.util';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import mongoose from 'mongoose';
import { describe } from 'node:test';
import { IUserInput } from '../../../types/user/user.interface';
import { Response } from 'express';

describe('AuthController (unit)', () => {
  let controller: AuthController;
  let mockAuthService: Partial<Record<keyof AuthService, jest.Mock>> = {
    registerUser: jest.fn(),
    loginUser: jest.fn(),
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
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });
  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('registerUser', () => {
    it('should be able to register a user if user is not exist', async () => {
      const userDto: IUserInput = {
        name: 'test',
        username: 'test',
        email: 'test@gmail.com',
        password: '12345678',
      };

      mockAuthService.registerUser.mockResolvedValue({
        refreshToken: 'refreshToken',
        accessToken: 'accessToken',
      });

      const mockRes = {
        cookie: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await controller.registerUser(userDto, mockRes);

      expect(mockAuthService.registerUser).toHaveBeenCalledWith(userDto);
      expect(mockRes.cookie).toHaveBeenCalledWith(
        'accessToken',
        'accessToken',
        expect.any(Object),
      );
      expect(mockRes.cookie).toHaveBeenCalledWith(
        'refreshToken',
        'refreshToken',
        expect.any(Object),
      );
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'welcome to shop center',
      });
    });
  });

  describe('loginUser', () => {
    it('should be able to login user if user is exist', async () => {
      const userDto = {
        username: 'test',
        password: '12345678',
      };

      mockAuthService.loginUser.mockResolvedValue({
        refreshToken: 'refreshToken',
        accessToken: 'accessToken',
      });

      const mockRes = {
        cookie: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await controller.loginUser(userDto, mockRes);

      expect(mockAuthService.loginUser).toHaveBeenCalledWith(userDto);
      expect(mockRes.cookie).toHaveBeenCalledWith(
        'accessToken',
        'accessToken',
        expect.any(Object),
      );
      expect(mockRes.cookie).toHaveBeenCalledWith(
        'refreshToken',
        'refreshToken',
        expect.any(Object),
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'welcome back to shop center',
      });
    });
  });
});

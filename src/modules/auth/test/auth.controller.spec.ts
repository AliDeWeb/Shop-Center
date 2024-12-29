import { Test } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import mongoose, { Schema } from 'mongoose';
import { describe } from 'node:test';
import { Response, Request } from 'express';
import { IUser, IUserReq } from '../../../types/user/user.interface';
import { UserRepository } from '../../user/repo/user.repository';
import { UserService } from '../../user/user.service';
import { JwtModule } from '@nestjs/jwt';
import { getEnv } from '../../../utils/getEnv/getEnvs.util';

describe('AuthController (unit)', () => {
  let controller: AuthController;
  const mockAuthService: Partial<Record<keyof AuthService, jest.Mock>> = {
    registerUser: jest.fn(),
    loginUser: jest.fn(),
    generateNewAccessToken: jest.fn(),
    logout: jest.fn(),
  };
  const mockUserRepo: Partial<Record<keyof UserRepository, jest.Mock>> = {
    create: jest.fn(),
    delete: jest.fn(),
    getById: jest.fn(),
    update: jest.fn(),
    find: jest.fn(),
  };
  const mockUserService: Partial<Record<keyof UserService, jest.Mock>> = {
    updateUser: jest.fn(),
    getUserById: jest.fn(),
    findUser: jest.fn(),
    deleteUserById: jest.fn(),
    createUser: jest.fn(),
  };

  beforeAll(async () => {
    process.env.JWT_SECRET_KEY = '1234';
    process.env.JWT_ACCESS_TOKEN_EXPIRES_IN = '15m';
    process.env.JWT_ACCESS_REFRESH_EXPIRES_IN = '7d';
    process.env.BCRYPT_SALT = '6';

    const module = await Test.createTestingModule({
      imports: [
        JwtModule.registerAsync({
          useFactory: async () => ({ secret: getEnv('JWT_SECRET_KEY') }),
        }),
      ],
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: UserRepository,
          useValue: mockUserRepo,
        },
        {
          provide: UserService,
          useValue: mockUserService,
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
      const userDto: IUser = {
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

  describe('generateNewAccessToken', () => {
    it('should be able to generate a new access token if user exists and token is valid', async () => {
      const mockRes = {
        cookie: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
      const mockReq = {
        cookies: {
          refreshToken: 'refreshToken',
        },
      } as unknown as Request;

      mockAuthService.generateNewAccessToken.mockResolvedValue({
        refreshToken: 'refreshToken',
        accessToken: 'accessToken',
      });

      await controller.generateNewAccessToken(mockRes, mockReq);

      expect(mockAuthService.generateNewAccessToken).toHaveBeenCalledWith(
        mockReq.cookies.refreshToken,
      );
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
        message: 'successfully generated access token',
      });
    });
  });

  describe('logout', () => {
    it('should logout user if user exist', async () => {
      const mockRequest = {
        user: {
          _id: '12345678',
          name: 'John Doe',
          email: 'john@example.com',
          password: '123456',
          username: 'John Doe',
        },
      } as IUserReq;

      mockAuthService.logout.mockReturnValue(undefined);

      await controller.logout(mockRequest);

      expect(mockAuthService.logout).toHaveBeenCalledWith(
        mockRequest.user._id as Schema.Types.ObjectId,
      );
    });
  });
});

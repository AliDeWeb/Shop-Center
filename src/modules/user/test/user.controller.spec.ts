import { UserController } from '../user.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '../../common/guard/auth.guard';
import mongoose from 'mongoose';
import { describe } from 'node:test';
import { IUserDocument, IUserReq } from '../../../types/user/user.interface';
import { Request } from 'express';
import { UserService } from '../user.service';
import { UserRepository } from '../repo/user.repository';

describe('UserController (unit)', () => {
  let controller: UserController;
  const mockService: Partial<Record<keyof UserService, jest.Mock>> = {
    updateUser: jest.fn(),
  };
  const mockRepo: Partial<Record<keyof UserRepository, jest.Mock>> = {
    create: jest.fn(),
    delete: jest.fn(),
    getById: jest.fn(),
    update: jest.fn(),
    find: jest.fn(),
  };

  beforeAll(async () => {
    const mockAuthGuard = {
      canActivate: (context: ExecutionContext) => true,
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockService,
        },
        {
          provide: UserRepository,
          useValue: mockRepo,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .compile();

    controller = module.get<UserController>(UserController);
  });
  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getMe', () => {
    it('should return user data', async () => {
      const mockRequest = {
        user: {
          name: 'John Doe',
          email: 'john@example.com',
          password: '123456',
          username: 'John Doe',
        },
      } as Request & { user: IUserDocument };

      const result = controller.getMe(mockRequest);

      expect(result).toEqual({
        name: 'John Doe',
        email: 'john@example.com',
        username: 'John Doe',
      });
    });
  });

  describe('updateMe', () => {
    it('should update and return user data if user exist', async () => {
      const mockRequest = {
        user: {
          name: 'John Doe',
          email: 'john@example.com',
          password: '123456',
          username: 'John Doe',
        },
      } as IUserReq;
      const newName = 'test';

      mockService.updateUser.mockResolvedValue({
        ...mockRequest.user,
        username: newName,
      });

      const result = await controller.updateMe(mockRequest, {
        username: newName,
      });

      expect(result.data.username).toEqual(newName);
    });
  });
});

import { UserController } from '../user.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { testDBUri } from '../../../../test/test-utils';
import { ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '../../common/guard/auth.guard';
import mongoose from 'mongoose';
import { describe } from 'node:test';
import { IUserDocument } from '../../../types/user/user.interface';
import { Request } from 'express';

describe('UserController (unit)', () => {
  let controller: UserController;

  beforeAll(async () => {
    const mockAuthGuard = {
      canActivate: (context: ExecutionContext) => true,
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [MongooseModule.forRoot(testDBUri)],
      controllers: [UserController],
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
});

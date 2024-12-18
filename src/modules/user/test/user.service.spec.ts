import { Test } from '@nestjs/testing';
import { UserService } from '../user.service';
import { UserRepository } from '../repo/user.repository';
import mongoose from 'mongoose';
import { NotFoundException } from '@nestjs/common';

describe('UserService (unit)', () => {
  let service: UserService;
  let repo: Partial<Record<keyof UserRepository, jest.Mock>>;

  beforeAll(async () => {
    const mockRepo = {
      create: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
      getById: jest.fn(),
      find: jest.fn(),
    };

    repo = mockRepo;

    const module = await Test.createTestingModule({
      providers: [UserService, { provide: UserRepository, useValue: mockRepo }],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUser', () => {
    it("should return user when it's found", async () => {
      const userId = new mongoose.Types.ObjectId();
      const user = { _id: userId, name: 'Ali' };

      repo.getById.mockResolvedValue(user);

      // @ts-ignore
      const result = await service.getUserById(userId._id);

      expect(result).toEqual(user);
    });

    it('should throw an exception when user is not found', async () => {
      const userId = new mongoose.Types.ObjectId();
      repo.getById.mockResolvedValue(null);

      // @ts-ignore
      expect(service.getUserById(userId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findUser', () => {
    it("should return user when it's found", async () => {
      const userId = new mongoose.Types.ObjectId();
      const user = { _id: userId, name: 'Ali' };

      repo.find.mockResolvedValue([user]);

      const result = await service.findUser({ name: 'ali' });

      expect(result[0]).toEqual(user);
    });

    it('should throw an exception when user is not found', async () => {
      repo.find.mockResolvedValue([]);

      expect(service.findUser({ name: 'ali' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('createUser', () => {
    it('should create a new user and return it', async () => {
      const userDto = {
        name: 'Ali',
        username: 'AliDeWeb',
        email: 'alimoradi0business@gmail.com',
        password: '12345678',
      };

      repo.create.mockResolvedValue(userDto);

      const result = await service.createUser(userDto);

      expect(result).toEqual(userDto);
    });
  });

  describe('updateUser', () => {
    it('should update user if it is found', async () => {
      const userId = new mongoose.Types.ObjectId();
      const userDto = {
        name: 'Ali',
        username: 'AliDeWeb',
        email: 'alimoradi0business@gmail.com',
        password: '12345678',
      };
      const newPassword = '123456789';

      repo.update.mockResolvedValue({ ...userDto, password: newPassword });

      // @ts-ignore
      const result = await service.updateUser(userId, {
        password: newPassword,
      });

      expect(result.password).not.toEqual(userDto.password);
    });

    it('should throw an exception if user is not found', async () => {
      const userId = new mongoose.Types.ObjectId();
      const newPassword = '123456789';

      repo.update.mockResolvedValue(null);

      // @ts-ignore
      const result = service.updateUser(userId, {
        password: newPassword,
      });

      expect(result).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteUser', () => {
    it('should delete user if it is found', async () => {
      const userId = new mongoose.Types.ObjectId();
      const userDto = {
        name: 'Ali',
        username: 'AliDeWeb',
        email: 'alimoradi0business@gmail.com',
        password: '12345678',
      };

      repo.delete.mockResolvedValue(userDto);

      // @ts-ignore
      const result = await service.deleteUserById(userId);

      expect(result).toBeUndefined();
    });

    it('should throw an exception if user is not found', async () => {
      const userId = new mongoose.Types.ObjectId();

      repo.delete.mockResolvedValue(null);

      // @ts-ignore
      const result = service.deleteUserById(userId);

      expect(result).rejects.toThrow(NotFoundException);
    });
  });
});

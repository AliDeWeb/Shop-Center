import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from '../product.controller';
import { ProductService } from '../product.service';
import { describe } from 'node:test';
import { Schema } from 'mongoose';
import { UserRepository } from '../../user/repo/user.repository';
import { UserService } from '../../user/user.service';
import { AuthGuard } from '../../common/guard/auth.guard';
import { ExecutionContext } from '@nestjs/common';
import { RolesGuard } from '../../common/guard/roles.guard';

describe('ProductController (unit)', () => {
  let controller: ProductController;
  let service: Partial<Record<keyof ProductService, jest.Mock>> = {
    getProductById: jest.fn(),
    createProduct: jest.fn(),
    updateProduct: jest.fn(),
    deleteProduct: jest.fn(),
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
  const mockGuard = {
    canActivate: (context: ExecutionContext) => true,
  };

  beforeAll(async () => {
    process.env.JWT_SECRET_KEY = '1234';

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        { provide: ProductService, useValue: service },
        {
          provide: UserRepository,
          useValue: mockUserRepo,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockGuard)
      .overrideGuard(RolesGuard)
      .useValue(mockGuard)
      .compile();

    controller = module.get<ProductController>(ProductController);
  });

  describe('getProductById', () => {
    it('should return the product by id and description if it exists', async () => {
      const product = {
        id: '676c2bf2cac631ec9471ebcf' as unknown as Schema.Types.ObjectId,
        name: 'samsung',
        images: [],
      };

      service.getProductById.mockResolvedValue(product);

      const result = await controller.getProductById({
        id: product.id,
      });

      expect(result).toHaveProperty('name');
      expect(service.getProductById).toHaveBeenCalledWith(product.id);
    });
  });

  describe('createProduct', () => {
    it('should create product and return it', async () => {
      const productDto = {
        name: 'samsung',
        images: [],
        description: '',
      };

      service.createProduct.mockResolvedValue(productDto);

      const result = await controller.createProduct(productDto, [
        { filename: 'ali' } as Express.Multer.File,
      ]);

      expect(result).toMatchObject({
        message: expect.any(String),
        data: expect.any(Object),
      });
      expect(service.createProduct).toHaveBeenCalledWith(productDto);
    });
  });

  describe('updateProduct', () => {
    it('should update and return product if it exists', async () => {
      const product = {
        id: 'valid id' as unknown as Schema.Types.ObjectId,
        name: 'samsung',
      };

      service.updateProduct.mockResolvedValue(product);

      const result = await controller.updateProduct(
        { id: product.id },
        product,
      );

      expect(service.updateProduct).toHaveBeenCalledWith(product.id, product);
      expect(result).toMatchObject({
        message: expect.any(String),
        data: expect.any(Object),
      });
    });
  });

  describe('deleteProduct', () => {
    it('should delete product', async () => {
      const product = {
        id: 'valid id' as unknown as Schema.Types.ObjectId,
        name: 'samsung',
      };

      service.deleteProduct.mockResolvedValue(undefined);

      const result = await controller.deleteProduct({ id: product.id });

      expect(service.deleteProduct).toHaveBeenCalledWith(product.id);
      expect(result).toMatchObject({ message: expect.any(String) });
    });
  });
});

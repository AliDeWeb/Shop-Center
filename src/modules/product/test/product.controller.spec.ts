import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from '../product.controller';
import { ProductService } from '../product.service';
import { describe } from 'node:test';
import { Schema } from 'mongoose';
import { BadRequestException } from '@nestjs/common';

describe('ProductController (unit)', () => {
  let controller: ProductController;
  let service: Partial<Record<keyof ProductService, jest.Mock>> = {
    getProductById: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [{ provide: ProductService, useValue: service }],
    }).compile();

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

    it('should throw err if id is invalid', async () => {
      const product = {
        id: 'invalid' as unknown as Schema.Types.ObjectId,
        name: 'samsung',
        images: [],
      };

      const result = controller.getProductById({
        id: product.id,
      });

      expect(result).rejects.toThrow(BadRequestException);
    });
  });
});

import { Test } from '@nestjs/testing';
import { ProductRepository } from '../repo/product.repository';
import { ProductService } from '../product.service';
import { describe } from 'node:test';
import { Schema } from 'mongoose';
import { NotFoundException } from '@nestjs/common';

describe('ProductService (unit)', () => {
  let service: ProductService;
  let repo: Partial<Record<keyof ProductRepository, jest.Mock>> = {
    create: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
    getById: jest.fn(),
    find: jest.fn(),
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ProductService,
        { provide: ProductRepository, useValue: repo },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
  });

  describe('getProductById', () => {
    it('should return product if it is exist', async () => {
      const product = {
        id: 'valid id',
        name: 'samsung',
        images: [],
      };

      repo.getById.mockResolvedValue(product);

      const result = await service.getProductById(
        product.id as unknown as Schema.Types.ObjectId,
      );

      expect(result).toEqual(product);
      expect(repo.getById).toHaveBeenCalledWith(product.id);
    });

    it('should throw error if product is not exist', async () => {
      const product = {
        id: 'invalid id',
      };

      repo.getById.mockResolvedValue(null);

      const result = service.getProductById(
        product.id as unknown as Schema.Types.ObjectId,
      );

      expect(result).rejects.toThrow(NotFoundException);
      expect(repo.getById).toHaveBeenCalledWith(product.id);
    });
  });

  describe(`createProduct`, () => {
    it('should create product and return it', async () => {
      const productDto = {
        id: 'valid id',
        name: 'samsung',
        images: [],
      };

      repo.create.mockResolvedValue(productDto);

      const result = await service.createProduct(productDto);

      expect(result).toEqual(productDto);
      expect(repo.create).toHaveBeenCalledWith(productDto);
    });
  });
});

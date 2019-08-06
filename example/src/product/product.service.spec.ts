import { badRequest, notFound, Result } from 'fail-not-core';
import { ProductMockRepository } from './product.repository.mock';
import { ProductService, ProductServiceFactory } from './product.service';

describe('ProductService', () => {
  let productService: ProductService;

  beforeEach(() => {
    productService = ProductServiceFactory([ProductMockRepository]);
  });

  describe('getAll', () => {
    it('should return an array of products', async () => {
      expect(await productService.getAll()).toStrictEqual(
        Result.success([
          {
            id: 1,
            title: 'Coke',
            price: 2000,
          },
          {
            id: 2,
            title: 'Water',
            price: 1000,
          },
        ]),
      );
    });
  });

  describe('getOne', () => {
    it('should return a product', async () => {
      expect(await productService.getOne(1)).toStrictEqual(
        Result.success({
          id: 1,
          title: 'Coke',
          price: 2000,
        }),
      );
    });
    it('should return notFound when product does not exist', async () => {
      expect(await productService.getOne(-1)).toStrictEqual(
        Result.failure(notFound('Product not found')),
      );
    });
  });

  describe('add', () => {
    it('should return generated id', async () => {
      expect(
        await productService.add({ title: 'Gatorade', price: 1000 }),
      ).toStrictEqual(Result.success(3));
    });
    it('should return badRequest when title is duplicate', async () => {
      expect(
        await productService.add({ title: 'Coke', price: 1000 }),
      ).toStrictEqual(Result.failure(badRequest('Duplicate title')));
    });
  });

  describe('edit', () => {
    it('should return success', async () => {
      expect(
        Result.isSuccess(
          await productService.edit([1, { title: 'Gatorade', price: 1000 }]),
        ),
      ).toBe(true);
    });
    it('should return notFound when product does not exist', async () => {
      expect(
        await productService.edit([-1, { title: 'Gatorade', price: 1000 }]),
      ).toStrictEqual(Result.failure(notFound('Product not found')));
    });
  });
});

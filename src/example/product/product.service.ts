import { AsyncResult, notFound, pipe, Result } from '../..';
import { badRequest } from '../../response/bad-request';
import { CreateProductDto } from './dtos/create-product.dto';
import { ProductRepository } from './product.repository';

function ProductServiceFactory([productRepository]: [ProductRepository]) {
  const getAll = () => productRepository.getAll();

  const getOne = pipe(
    productRepository.getOne,
    AsyncResult.bind(async product => {
      if (!product) {
        return Result.failure(notFound('Product not found' as const));
      }
      return Result.success(product);
    }),
  );

  const checkDuplicateTitle = (createProductDto: CreateProductDto) =>
    pipe(
      productRepository.getOneByTitle,
      AsyncResult.bind(async product => {
        if (!!product) {
          return Result.failure(badRequest('Duplicate title' as const));
        }
        return Result.success(createProductDto);
      }),
    )(createProductDto.title);

  const add = pipe(
    checkDuplicateTitle,
    AsyncResult.bind(productRepository.add),
  );

  const edit = (id: number, editProductDto: CreateProductDto) =>
    pipe(
      getOne,
      AsyncResult.bind(() => productRepository.edit(id, editProductDto)),
    )(id);

  return {
    getAll,
    getOne,
    add,
    edit,
  };
}

export const ProductService = ProductServiceFactory([ProductRepository]);
export type ProductService = typeof ProductService;

import { AsyncResult, existing, ifElse, notFound, pipe, Result } from '../..';
import { badRequest } from '../../response/bad-request';
import { CreateProductDto } from './dtos/create-product.dto';
import { ProductRepository } from './product.repository';

export function ProductServiceFactory([productRepository]: [ProductRepository]) {
  const getAll = () => productRepository.getAll();

  const getOne = pipe(
    productRepository.getOne,
    AsyncResult.bind(
      ifElse({
        if: existing,
        then: Result.success,
        else: () => Result.failure(notFound('Product not found' as const)),
      }),
    ),
  );

  const checkDuplicateTitle = (createProductDto: CreateProductDto) =>
    pipe(
      productRepository.getOneByTitle,
      AsyncResult.bind(
        ifElse({
          if: existing,
          then: () => Result.failure(badRequest('Duplicate title' as const)),
          else: () => Result.success(createProductDto),
        }),
      ),
    )(createProductDto.title);

  const add = pipe(
    checkDuplicateTitle,
    AsyncResult.bind(productRepository.add),
  );

  const edit = (id: number) => (editProductDto: CreateProductDto) =>
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

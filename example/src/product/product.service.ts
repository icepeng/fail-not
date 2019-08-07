import {
  AsyncResult,
  badRequest,
  Injected,
  Maybe,
  notFound,
  pipe,
  Result,
} from 'fail-not-core';
import { CreateProductDto } from './dtos/create-product.dto';
import { ProductRepository } from './product.repository';

export function ProductServiceFactory([productRepository]: [
  ProductRepository,
]) {
  const getAll = productRepository.getAll;

  const getOne = pipe(
    productRepository.getOne,
    AsyncResult.bind(
      Maybe.fold(Result.success, () =>
        Result.failure(notFound('Product not found' as const)),
      ),
    ),
  );

  const checkDuplicateTitle = (createProductDto: CreateProductDto) =>
    pipe(
      productRepository.getOneByTitle,
      AsyncResult.bind(
        Maybe.fold(
          () => Result.failure(badRequest('Duplicate title' as const)),
          () => Result.success(createProductDto),
        ),
      ),
    )(createProductDto.title);

  const add = pipe(
    checkDuplicateTitle,
    AsyncResult.bind(productRepository.add),
  );

  const edit = ([id, editProductDto]: [number, CreateProductDto]) =>
    pipe(
      getOne,
      AsyncResult.bind(() => productRepository.edit(id)(editProductDto)),
    )(id);

  return {
    getAll,
    getOne,
    add,
    edit,
  };
}

export type ProductService = Injected<typeof ProductServiceFactory>;

import {
  AsyncResult,
  Body,
  get,
  ok,
  Param,
  pipe,
  post,
  prefixRoutes,
  put,
  Result,
  Routes,
  toInt,
} from 'fail-not-core';
import { createProductDtoValidator } from './dtos/create-product.dto';
import { ProductService } from './product.service';

export function ProductControllerFactory([productService]: [
  ProductService,
]): Routes {
  const getAll = get(
    '',
    pipe(
      productService.getAll,
      AsyncResult.fold(products => ok({ products })),
    ),
  );

  const getOne = get(
    ':id',
    pipe(
      Param('id'),
      toInt,
      productService.getOne,
      AsyncResult.fold(products => ok({ products })),
    ),
  );

  const add = post(
    '',
    pipe(
      Body(),
      createProductDtoValidator,
      AsyncResult.bind(productService.add),
      AsyncResult.fold(id => ok({ id })),
    ),
  );

  const edit = put(
    ':id',
    pipe(
      Result.sequence(
        pipe(
          Param('id'),
          toInt,
          Result.success,
        ),
        pipe(
          Body(),
          createProductDtoValidator,
        ),
      ),
      AsyncResult.bind(productService.edit),
      AsyncResult.fold(() => ok({})),
    ),
  );

  return prefixRoutes('products', [getAll, getOne, add, edit]);
}

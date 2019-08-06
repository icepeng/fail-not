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
      AsyncResult.match(products => ok({ products })),
    ),
  );

  const getOne = get(
    ':id',
    pipe(
      Param('id'),
      toInt,
      productService.getOne,
      AsyncResult.match(products => ok({ products })),
    ),
  );

  const add = post(
    '',
    pipe(
      Body(),
      createProductDtoValidator,
      AsyncResult.bind(productService.add),
      AsyncResult.match(id => ok({ id })),
    ),
  );

  const edit = put(
    ':id',
    pipe(
      Result.combine(
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
      AsyncResult.match(() => ok({})),
    ),
  );

  return prefixRoutes('products', [getAll, getOne, add, edit]);
}

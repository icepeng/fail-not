import {
  AsyncResult,
  Body,
  controller,
  get,
  ok,
  Param,
  pipe,
  post,
  put,
  Result,
  toInt,
} from '../..';
import { Controller } from '../../controller';
import { createProductDtoValidator } from './dtos/create-product.dto';
import { ProductService } from './product.service';

function ProductControllerFactory([productService]: [
  ProductService
]): Controller {
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
      req =>
        AsyncResult.liftA2(productService.edit)(
          pipe(
            Param('id'),
            toInt,
            Result.success,
          )(req),
        )(
          pipe(
            Body(),
            createProductDtoValidator,
          )(req),
        ),
      AsyncResult.match(() => ok({})),
    ),
  );

  return controller('products', [getAll, getOne, add, edit]);
}

export const ProductController = ProductControllerFactory([ProductService]);

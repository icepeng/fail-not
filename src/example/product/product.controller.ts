import {
  createProductDtoValidator,
  CreateProductDto,
} from './dtos/create-product.dto';
import { ProductService } from './product.service';
import {
  get,
  post,
  put,
  Route,
  controller,
  applyMany,
  Body,
  Param,
  ok,
  pipe,
  AsyncResult,
} from '../..';

function ProductControllerFactory([productService]: [ProductService]): Route[] {
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
      id => productService.getOne(+id),
      AsyncResult.match(products => ok({ products })),
    ),
  );

  const add = post(
    '',
    pipe(
      Body(),
      createProductDtoValidator,
      AsyncResult.fromResult,
      AsyncResult.bind(body => productService.add(body)),
      AsyncResult.match(id => ok({ id })),
    ),
  );

  const edit = put(
    ':id',
    pipe(
      applyMany(Param('id'), Body<CreateProductDto>()),
      ([id, body]) =>
        pipe(
          createProductDtoValidator,
          AsyncResult.fromResult,
          AsyncResult.bind(validated => productService.edit(+id, validated)),
          AsyncResult.match(() => ok({})),
        )(body),
    ),
  );

  return controller('products', [getAll, getOne, add, edit]);
}

export const ProductController = ProductControllerFactory([ProductService]);

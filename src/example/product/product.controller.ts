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
  Route,
  toInt,
} from '../..';
import {
  CreateProductDto,
  createProductDtoValidator,
} from './dtos/create-product.dto';
import { ProductService } from './product.service';

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
      Param('id', toInt),
      productService.getOne,
      AsyncResult.match(products => ok({ products })),
    ),
  );

  const validateBody = pipe(
    Body(),
    createProductDtoValidator,
    AsyncResult.fromResult,
  );

  const add = post(
    '',
    pipe(
      validateBody,
      AsyncResult.bind(body => productService.add(body)),
      AsyncResult.match(id => ok({ id })),
    ),
  );

  const getId = pipe(
    Param('id', toInt),
    AsyncResult.success,
  );

  const edit = put(
    ':id',
    pipe(
      req =>
        AsyncResult.liftA2((id: number) => (body: CreateProductDto) => ({
          id,
          body,
        }))(getId(req))(validateBody(req)),
      AsyncResult.bind(({ id, body }) => productService.edit(id, body)),
      AsyncResult.match(() => ok({})),
    ),
  );

  return controller('products', [getAll, getOne, add, edit]);
}

export const ProductController = ProductControllerFactory([ProductService]);

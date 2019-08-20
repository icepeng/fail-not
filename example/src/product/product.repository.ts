import {
  AsyncResult,
  Injected,
  internalServerError,
  pipe,
} from 'fail-not-core';
import { TypeormService } from '../typeorm.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { Product } from './product.entity';

export function ProductRepositoryFactory([{ connection }]: [TypeormService]) {
  const productRepo = connection.getRepository(Product);
  const errorHandler = () => internalServerError('DB_ERROR' as const);

  const getAll = () =>
    AsyncResult.tryCatch(() => productRepo.find(), errorHandler);

  const getOne = (id: number) =>
    AsyncResult.tryCatch(() => productRepo.findOne(id), errorHandler);

  const getOneByTitle = (title: string) =>
    AsyncResult.tryCatch(() => productRepo.findOne({ title }), errorHandler);

  const add = pipe(
    (createProductDto: CreateProductDto) =>
      productRepo.create(createProductDto),
    product =>
      AsyncResult.tryCatch(() => productRepo.save(product), errorHandler),
    AsyncResult.map(res => res.id),
  );

  const edit = (id: number) =>
    pipe(
      (editProductDto: CreateProductDto) =>
        productRepo.create({ id, ...editProductDto }),
      product =>
        AsyncResult.tryCatch(() => productRepo.save(product), errorHandler),
      AsyncResult.map(res => res.id),
    );

  return {
    getAll,
    getOne,
    getOneByTitle,
    add,
    edit,
  } as const;
}

export type ProductRepository = Injected<typeof ProductRepositoryFactory>;

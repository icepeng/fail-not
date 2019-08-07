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

  const getAll = () =>
    AsyncResult.tryCatch(productRepo.find, () =>
      internalServerError('DB_ERROR' as const),
    );

  const getOne = (id: number) =>
    AsyncResult.tryCatch(
      () => productRepo.findOne(id),
      () => internalServerError('DB_ERROR' as const),
    );

  const getOneByTitle = (title: string) =>
    AsyncResult.tryCatch(
      () => productRepo.findOne({ title }),
      () => internalServerError('DB_ERROR' as const),
    );

  const add = pipe(
    (createProductDto: CreateProductDto) =>
      productRepo.create(createProductDto),
    product =>
      AsyncResult.tryCatch(
        () => productRepo.save(product),
        () => internalServerError('DB_ERROR' as const),
      ),
    AsyncResult.map(res => res.id),
  );

  const edit = (id: number) =>
    pipe(
      (editProductDto: CreateProductDto) =>
        productRepo.create({ id, ...editProductDto }),
      product =>
        AsyncResult.tryCatch(
          () => productRepo.save(product),
          () => internalServerError('DB_ERROR' as const),
        ),
      AsyncResult.map(res => res.id),
    );

  return {
    getAll,
    getOne,
    getOneByTitle,
    add,
    edit,
  };
}

export type ProductRepository = Injected<typeof ProductRepositoryFactory>;

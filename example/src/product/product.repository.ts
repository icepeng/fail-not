import {
  AsyncInjector,
  AsyncResult,
  Unpacked,
  internalServerError,
  InternalServerError,
} from 'fail-not-core';
import { TypeormService } from '../typeorm.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { Product } from './product.entity';

function ProductRepositoryFactory([{ connection }]: [TypeormService]) {
  const productRepo = connection.getRepository(Product);

  async function getAll(): AsyncResult<
    Product[],
    InternalServerError<'DB_ERROR'>
  > {
    return productRepo
      .find()
      .then(AsyncResult.success)
      .catch(() => AsyncResult.failure(internalServerError('DB_ERROR')));
  }

  async function getOne(
    id: number,
  ): AsyncResult<Product | undefined, InternalServerError<'DB_ERROR'>> {
    return productRepo
      .findOne(id)
      .then(AsyncResult.success)
      .catch(() => AsyncResult.failure(internalServerError('DB_ERROR')));
  }

  async function getOneByTitle(
    title: string,
  ): AsyncResult<Product | undefined, InternalServerError<'DB_ERROR'>> {
    return productRepo
      .findOne({ title })
      .then(AsyncResult.success)
      .catch(() => AsyncResult.failure(internalServerError('DB_ERROR')));
  }

  async function add(
    createProductDto: CreateProductDto,
  ): AsyncResult<number, InternalServerError<'DB_ERROR'>> {
    const product = productRepo.create(createProductDto);
    return productRepo
      .save(product)
      .then(res => AsyncResult.success(res.id))
      .catch(() => AsyncResult.failure(internalServerError('DB_ERROR')));
  }

  async function edit(
    id: number,
    editProductDto: CreateProductDto,
  ): AsyncResult<number, InternalServerError<'DB_ERROR'>> {
    const product = productRepo.create({ id, ...editProductDto });
    return productRepo
      .save(product)
      .then(res => AsyncResult.success(res.id))
      .catch(() => AsyncResult.failure(internalServerError('DB_ERROR')));
  }

  return {
    getAll,
    getOne,
    getOneByTitle,
    add,
    edit,
  };
}

export const ProductRepository = AsyncInjector(ProductRepositoryFactory, [
  TypeormService,
]);
export type ProductRepository = Unpacked<typeof ProductRepository>;
